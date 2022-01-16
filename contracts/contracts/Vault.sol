// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./utility/Whitelist.sol";
import "./utility/VaultToken.sol";
import "./interfaces/IVaultToken.sol";

contract Vault is ReentrancyGuard, Whitelist, ERC1155Holder {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    enum ContractState {
        PREPARE,
        AUCTIONING,
        LISTED
    }

    struct NftItem {
        address assetAddress;
        uint256 tokenId;
        bool is1155;
        bool deposited;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 totalValue;
    }

    struct ClaimData {
        uint256 vaultToken; // FRACTIONALIZED NFT TOKEN
        uint256 settlementToken; // ONE TOKEN
    }

    // name of the vault
    string public name;
    string public symbol;
    address public creatorAddress;
    // ref. price to be displayed (in ONE)
    uint256 public referencePrice;
    // when the auction ended
    uint256 public auctionEnded;
    // Contract state
    ContractState public state;
    // Vault token created by this contract.
    IVaultToken public vaultToken;
    // Bidder table
    Bid[] public bidding;
    uint256 public auctionCount;
    // Claim table
    mapping(address => ClaimData) public claimData;

    uint256 public totalToken;
    uint256 public totalSettlementToken;

    // NFT deposited for ERC-20 IDO
    mapping(uint256 => NftItem) public intialList;
    uint256 public intialListCount;

    uint256 constant MAX_UINT256 = uint256(-1);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _ending,
        address _creatorAddress,
        uint256 _referencePrice // ideally the floor price for the collection (in ONE)
    ) public {
        require(_ending != 0, "Invalid _ending");
        require(_referencePrice != 0, "Invalid _referencePrice");

        name = _name;
        symbol = _symbol;
        state = ContractState.PREPARE;

        auctionEnded = block.timestamp + _ending;

        // Deploy the vault token
        VaultToken deployedContract = new VaultToken(_name, _symbol, 18);
        vaultToken = IVaultToken(address(deployedContract));

        creatorAddress = _creatorAddress;
        referencePrice = _referencePrice;

        if (_creatorAddress != msg.sender) {
            addAddress(_creatorAddress);
        }
    }

    // PUBLIC READ-ONLY FUNCTIONS

    // total ERC-20 tokens to be issued
    function totalIssuingToken() public view returns (uint256) {
        return totalToken;
    }

    function currentAuction() public view returns (uint256) {
        return auctionCount;
    }

    // PREPARATION STAGE

    // add NFT to the intial list
    function add(address _assetAddress, uint256 _tokenId)
        public
        nonReentrant
        onlyWhitelisted
    {
        require(state == ContractState.PREPARE, "Invalid contract state");

        // take the NFT
        IERC1155(_assetAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            1,
            "0x00"
        );

        // add it to the initial list
        intialList[intialListCount].assetAddress = _assetAddress;
        intialList[intialListCount].tokenId = _tokenId;
        intialList[intialListCount].is1155 = true;
        intialList[intialListCount].deposited = true;

        intialListCount += 1;
        totalToken += 1 ether;
    }

    // remove NFT from the initial list
    function remove(uint256 _id) public nonReentrant onlyWhitelisted {
        require(state == ContractState.PREPARE, "Invalid contract state");
        require(intialListCount > _id, "Invalid given id");
        require(intialList[_id].deposited == true, "Invalid deposit flag");

        intialList[_id].deposited = false;

        IERC1155(intialList[_id].assetAddress).safeTransferFrom(
            address(this),
            msg.sender,
            intialList[_id].tokenId,
            1,
            "0x00"
        );

        totalToken -= 1 ether;
    }

    // looks for the asset address for the given id
    function assetAddressOf(uint256 _id) public view returns (address) {
        require(state == ContractState.PREPARE, "Invalid contract state");
        require(intialListCount > _id, "Invalid given id");

        return intialList[_id].assetAddress;
    }

    function extendAuction(uint256 _ending)
        public
        nonReentrant
        onlyWhitelisted
    {
        auctionEnded += _ending;
    }

    // AUCTION STAGE

    // start the auction process
    function startAuctionProcess() public nonReentrant onlyWhitelisted {
        require(state == ContractState.PREPARE, "Invalid contract state");
        require(auctionEnded > block.timestamp, "auctionEnded has been passed");

        state = ContractState.AUCTIONING;
    }

    // amount -> total ERC-20 want to bidding, value -> ONE to be deposited
    function bid(uint256 _amount, uint256 _value) public payable nonReentrant {
        require(msg.value == _value, "Payment is not attached");
        require(state == ContractState.AUCTIONING, "Invalid contract state");
        require(auctionEnded > block.timestamp, "auctionEnded has been passed");
        require(_amount > 0 && _value > 0, "Invalid amount");

        bidding.push(
            Bid({bidder: msg.sender, amount: _amount, totalValue: _value})
        );

        totalSettlementToken = totalSettlementToken.add(_value);
    }

    // finalize the auction
    function finalize() public nonReentrant onlyWhitelisted {
        require(block.timestamp > auctionEnded, "Auction is not yet finished");
         require(state == ContractState.AUCTIONING, "Invalid contract state");

        Bid[] memory sortedBidding = _sort(bidding);

        uint256 remaining = totalToken;

        for (uint256 i = 0; i < sortedBidding.length; i++) {
            Bid memory bidInfo = sortedBidding[i];

            if (remaining == 0) {
                // no more token left
                claimData[bidInfo.bidder].settlementToken = claimData[
                    bidInfo.bidder
                ].settlementToken.add(bidInfo.totalValue);
            } else if (bidInfo.amount >= remaining) {
                uint256 overpaid = bidInfo.amount.sub(remaining);
                uint256 overpaidInSettlement = (
                    (bidInfo.totalValue.mul(overpaid))
                ).div(bidInfo.amount);

                claimData[bidInfo.bidder].vaultToken = claimData[bidInfo.bidder]
                    .vaultToken
                    .add(remaining);
                claimData[bidInfo.bidder].settlementToken = claimData[
                    bidInfo.bidder
                ].settlementToken.add(overpaidInSettlement);

                // debit the creator
                claimData[creatorAddress].settlementToken = claimData[
                    creatorAddress
                ].settlementToken.add(
                        bidInfo.totalValue.sub(overpaidInSettlement)
                    );

                remaining = 0;
            } else {
                claimData[bidInfo.bidder].vaultToken = claimData[bidInfo.bidder]
                    .vaultToken
                    .add(bidInfo.amount);
                // debit the creator
                claimData[creatorAddress].settlementToken = claimData[
                    creatorAddress
                ].settlementToken.add(bidInfo.totalValue);

                remaining = remaining.sub(bidInfo.amount);
            }
        }

        // clear the array
        uint256 max = bidding.length;

        for (uint256 i = 0; i < max; i++) {
            bidding.pop();
        }

        state = ContractState.LISTED;
    }

    // LISTED STAGE

    function claim() public nonReentrant {
        require(state == ContractState.LISTED, "Invalid contract state");

        if (claimData[msg.sender].vaultToken > 0) {
            // mint TOKEN back to the user
            vaultToken.mint(msg.sender, claimData[msg.sender].vaultToken);

            claimData[msg.sender].vaultToken = 0;
            totalToken = totalToken.sub(claimData[msg.sender].vaultToken);
        }

        if (claimData[msg.sender].settlementToken > 0) {
            uint256 amount = claimData[msg.sender].settlementToken;
            _safeTransferETH(msg.sender, amount);

            claimData[msg.sender].settlementToken = 0;

            totalSettlementToken = totalSettlementToken.sub(
                claimData[msg.sender].settlementToken
            );
        }
    }

    function restart() public nonReentrant onlyWhitelisted {
        state = ContractState.PREPARE;
    }

    // TODO : FRACTIONAL NFT ERC-20 -> NFT

    // PRIVATE FUNCTIONS

    function _quickSort(
        Bid[] memory arr,
        int256 left,
        int256 right
    ) private pure {
        int256 i = left;
        int256 j = right;
        if (i == j) return;
        uint256 pivot = arr[uint256(left + (right - left) / 2)].totalValue;
        while (i <= j) {
            while (arr[uint256(i)].totalValue > pivot) i++;
            while (pivot > arr[uint256(j)].totalValue) j--;
            if (i <= j) {
                (arr[uint256(i)], arr[uint256(j)]) = (
                    arr[uint256(j)],
                    arr[uint256(i)]
                );
                i++;
                j--;
            }
        }
        if (left < j) _quickSort(arr, left, j);
        if (i < right) _quickSort(arr, i, right);
    }

    function _sort(Bid[] memory data) private pure returns (Bid[] memory) {
        _quickSort(data, int256(0), int256(data.length - 1));
        return data;
    }

    function _safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(
            success,
            "TransferHelper::safeTransferETH: ETH transfer failed"
        );
    }
}

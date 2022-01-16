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
import "./interfaces/IPancakePair.sol";
import "./interfaces/IPancakeRouter02.sol";
import "./interfaces/IPancakeFactory.sol";

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

    // name of the vault
    string public name;
    string public symbol;
    address public creatorAddress;
    // ref. price to be displayed
    uint256 public referencePrice;
    // when the auction ended
    uint256 public auctionEnded;
    // Contract state
    ContractState public state;
    // Vault token created by this contract.
    IVaultToken public vaultToken;

    // Collateral NFT for minting ERC-20
    mapping(uint256 => NftItem) public collaterals;
    uint256 public collateralCount;

    // NFT deposited for ERC-20 IDO
    mapping(uint256 => NftItem) public intialList;
    uint256 public intialListCount;
    uint256 public totalIntialListToken;

    uint256 constant MAX_UINT256 = uint256(-1);
    address constant ROUTER_ADDRESS =
        0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff; // Quickswap Router
    address constant SETTLEMENT_TOKEN = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174; // USDC on Polygon

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _ending,
        address _creatorAddress,
        uint256 _referencePrice // ideally the floor price for the collection
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

    function settlementToken() public pure returns (address) {
        return SETTLEMENT_TOKEN;
    }

    // PREPARATION STAGE

    // add NFT to the intial list
    function prepareAdd(address _assetAddress, uint256 _tokenId)
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
        totalIntialListToken += 1 ether;
    }

    // remove NFT from the initial list
    function prepareRemove(uint256 _id) public nonReentrant onlyWhitelisted {
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

        totalIntialListToken -= 1 ether;
    }

    // looks for the asset address for the given id
    function prepareAssetAddress(uint256 _id) public view returns (address) {
        require(state == ContractState.PREPARE, "Invalid contract state");
        require(intialListCount > _id, "Invalid given id");

        return intialList[_id].assetAddress;
    }

    // total ERC-20 tokens to be issued 
    function prepareTotalToken() public view returns (uint256) {
        return totalIntialListToken;
    }

    // AUCTION STAGE

    // start the auction process
    function startAuctionProcess() public  nonReentrant onlyWhitelisted {
        require(state == ContractState.PREPARE, "Invalid contract state");
        require(auctionEnded > block.timestamp, "auctionEnded has been passed");

        state = ContractState.AUCTIONING;
    }

    function bid() public nonReentrant {
        require(state == ContractState.PREPARE, "Invalid contract state");
        require(auctionEnded > block.timestamp, "auctionEnded has been passed");

    }



    // LISTED STAGE
}

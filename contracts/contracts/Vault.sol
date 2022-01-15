// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
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

    // name of the vault
    string public name;
    string public symbol;

    // Vault token created by this contract.
    IVaultToken public vaultToken;

    constructor(string memory _name, string memory _symbol) public {
        name = _name;
        symbol = _symbol;

        // Deploy the vault token
        VaultToken deployedContract = new VaultToken(_name, _symbol, 18);
        vaultToken = IVaultToken(address(deployedContract));

    }

}
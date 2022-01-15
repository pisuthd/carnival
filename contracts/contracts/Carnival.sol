// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
import "./utility/Whitelist.sol";
import "./utility/SyntheticToken.sol";
import "./interfaces/ISyntheticToken.sol";
import "./interfaces/IPancakePair.sol";
import "./interfaces/IPancakeRouter02.sol";
import "./interfaces/IPancakeFactory.sol";


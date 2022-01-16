# Carnival

> An auction-based NFT fractionalize project on Harmony chain made during NFTHack 2022

![carnival-logo (1)](https://user-images.githubusercontent.com/18402217/149608161-ca5b778b-aa25-4f54-b3b4-6959c81fd6ab.png)

## Introduction

To fractionalize NFT into ERC-20 is painful, it requires a huge upfront capital for its creator to setup the liquidity pool on any decentralized exchange regardless to the chain. We allow the NFT creator to crowdsourcing through the auction process and remove barrier of entry of having access a vase opportunity of fractionalized ownership of the NFT collection.

![Carnival (2)](https://user-images.githubusercontent.com/18402217/149610175-2d8e7cd5-adde-49a4-9432-79b1f67d5224.png)

With us to fractionalize 10 units of NFT, each value of $1,000, you can do crowdfunding right away and having a better access to the fund from the auction mechanism.

Due to the shorttime available during the hackathon, we can only complete the NFT -> ERC-20 part and accept on ERC-1155, the opposite path would use the similar concept to other platform which is allowing the ERC-20 holders to claim the NFT randomly from the vault or either paying fees to choose the specific NFT they want. 

## Live Demo

https://nostalgic-nightingale-4643e1.netlify.app/

## Features

* Support of ERC-1155 NFT
* Issue a fractionalized token from multiple NFT contract address 

## Install

This project comprises of 2 modules, the smart contracts and the frontend, before going a bit deeeper once this repo has been downloaded locally you can install all dependencies by run

```
yarn
```

### Solidity contracts

To test it, make sure you have Hardhat in your machine then run

```
cd contracts
npx hardhat test
```

To deploy it to the network, we're suggesting to use just Remix and we have a flatten version reside on /deployment folder, checkout the Medium article for more details.

### Frontend Dapp

This made by react-create-app that compatible to most modern browsers, to run it locally just run

```
cd client
yarn start
```


## Deployment

### Harmony Mainnet

Contract Name | Contract Address 
--- | --- 
Vault (Fake Cryptokitties) | 0x62faCcbe7980E14C8adDB3F0399eBaeDE66350be
NFT (Fake Cryptokitties) | 0x10Fe6ecb9a49276E068274711560CDe41Deb3f34 

## License

MIT ©

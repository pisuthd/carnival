const { expect } = require("chai");
const { ethers } = require("hardhat");

let admin
let alice
let bob
let charlie

let vault
let vaultToken
let erc1155

describe("Vault", function () {

    const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    const ROUTER_ADDRESS = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
    const DEADLINE = 2554013609

    before(async () => {

        [admin, alice, bob, charlie] = await ethers.getSigners()

        const Vault = await ethers.getContractFactory("Vault")
        const MockERC1155 = await ethers.getContractFactory("MockERC1155")

        vault = await Vault.deploy(
            "Test Vault",
            "TEST",
            3600, // 1 hour
            admin.address,
            ethers.utils.parseUnits("1", 6) // 1 USDC
        )

        erc1155 = await MockERC1155.deploy(
            "https://api.cryptokitties.co/kitties/{id}"
        )

        usdcToken = await ethers.getContractAt('MockERC20', USDC_ADDRESS)

        vaultToken = await vault.vaultToken()

        router = await ethers.getContractAt('IPancakeRouter02', ROUTER_ADDRESS)
    })

    it("Checks initial params", async () => {
        expect(await vault.name()).to.equal("Test Vault")
        expect(await vault.symbol()).to.equal("TEST")

        expect(vaultToken).to.not.equal("0x0000000000000000000000000000000000000000")
        // USDC
        expect(await vault.settlementToken()).to.equal(USDC_ADDRESS)
        // 1 USDC
        expect(await vault.referencePrice()).to.equal(ethers.utils.parseUnits("1", 6))
    })

    it("NFT creator prepares NFT for the auction", async () => {

        expect(await vault.state() === 0).to.true

        const tokenIds = [0, 1, 2, 3]

        // minting ERC-1155
        for (let id of tokenIds) {
            await erc1155.mint(admin.address, id, 1, "0x00")
        }

        await erc1155.setApprovalForAll(vault.address, true)

        for (let id of tokenIds) {
            await vault.prepareAdd(erc1155.address, id)
        }

        for (let id of tokenIds) {
            expect(await erc1155.balanceOf(vault.address, id)).to.equal(1)
        }

        expect(await vault.intialListCount()).to.equal(4)
        expect(await vault.totalIntialListToken()).to.equal(ethers.utils.parseEther("4"))

    })

    it("Let's Alice, Bob, Charlie bidding against it", async () => {

        // Acquire USDC from QuickSwap
        for (let user of [alice, bob, charlie]) {
            const minOutput = await router.getAmountsOut(ethers.utils.parseEther("1000"), [await router.WETH(), USDC_ADDRESS])
            await router.swapExactETHForTokens(minOutput[1], [await router.WETH(), USDC_ADDRESS], user.address, DEADLINE, { value: ethers.utils.parseEther("1000") })

            const usdcBalance = await usdcToken.balanceOf(user.address)
            expect(Number(ethers.utils.formatUnits(usdcBalance, 6)) > 1000).to.true
        }

        


    })

});


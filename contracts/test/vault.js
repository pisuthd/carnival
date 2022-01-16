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

    before(async () => {

        [admin, alice, bob, charlie] = await ethers.getSigners()

        const Vault = await ethers.getContractFactory("Vault")
        const MockERC1155 = await ethers.getContractFactory("MockERC1155")

        vault = await Vault.deploy(
            "Test Vault",
            "TEST",
            3600, // 1 hour
            admin.address,
            ethers.utils.parseUnits("1", 18) // 1 ONE
        )

        erc1155 = await MockERC1155.deploy(
            "https://api.cryptokitties.co/kitties/{id}"
        )

        const vaultTokenAddress = await vault.vaultToken()

        vaultToken = await ethers.getContractAt('MockERC20', vaultTokenAddress)
    })

    it("Checks initial params", async () => {
        expect(await vault.name()).to.equal("Test Vault")
        expect(await vault.symbol()).to.equal("TEST")

        expect(vaultToken.address).to.not.equal("0x0000000000000000000000000000000000000000")
        // 1 ONE
        expect(await vault.referencePrice()).to.equal(ethers.utils.parseUnits("1", 18))

        expect(await vault.currentAuction()).to.equal(0)
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
            await vault.add(erc1155.address, id)
        }

        for (let id of tokenIds) {
            expect(await erc1155.balanceOf(vault.address, id)).to.equal(1)
        }

        expect(await vault.intialListCount()).to.equal(4)
        expect(await vault.totalToken()).to.equal(ethers.utils.parseEther("4"))

    })

    it("Let's Alice, Bob, Charlie bidding against it & finalize", async () => {

        await vault.connect(admin).startAuctionProcess()

        // Alice bids 3 TOKENS for 3 ONE
        await vault.connect(alice).bid(ethers.utils.parseEther("3"), ethers.utils.parseUnits("3", 18), { value: ethers.utils.parseUnits("3", 18) })

        // Bob bids 3 TOKENS for 8 ONE
        await vault.connect(bob).bid(ethers.utils.parseEther("3"), ethers.utils.parseUnits("8", 18), { value: ethers.utils.parseUnits("8", 18) })

        // Charlie bids 2 TOKENS for 1 ONE
        await vault.connect(charlie).bid(ethers.utils.parseEther("2"), ethers.utils.parseUnits("1", 18), { value: ethers.utils.parseUnits("1", 18) })

        const { timestamp } = ( await ethers.provider.getBlock())

        // fast-forward 1 hr.
        await ethers.provider.send("evm_mine", [timestamp + 3600]);

        await vault.connect(admin).finalize()

        const aliceData = await vault.claimData( alice.address )
        expect( aliceData[0] ).to.equal( ethers.utils.parseEther("1") )
        expect( aliceData[1] ).to.equal( ethers.utils.parseEther("2"))

        const bobData = await vault.claimData( bob.address )
        expect( bobData[0] ).to.equal( ethers.utils.parseEther("3") )
        expect( bobData[1] ).to.equal( ethers.utils.parseEther("0"))

        const charlieData = await vault.claimData( charlie.address )
        expect( charlieData[0] ).to.equal( ethers.utils.parseEther("0") )
        expect( charlieData[1] ).to.equal( ethers.utils.parseEther("1"))

        const creatorData = await vault.claimData( admin.address )
        expect( creatorData[0] ).to.equal( ethers.utils.parseEther("0") )
        expect( creatorData[1] ).to.equal( ethers.utils.parseEther("9"))
        
    })

    it("Let's Alice, Bob, Charlie, Creator claiming their token", async () => {



        for (let user of [alice, bob, charlie, admin]) {

            const claimData = await vault.claimData( user.address )
            
            await vault.connect(user).claim()

            expect( await vaultToken.balanceOf( user.address )).to.equal(  claimData[0])
        }
        

    })

});


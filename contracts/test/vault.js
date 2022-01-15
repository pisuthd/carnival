const { expect } = require("chai");
const { ethers } = require("hardhat");

let admin
let alice
let bob

let vault
let vaultToken

describe("Vault", function () {

    before(async () => {

        [admin, alice, bob] = await ethers.getSigners()

        const Vault = await ethers.getContractFactory("Vault")

        vault = await Vault.deploy(
            "Test Vault",
            "TEST"
        )

        vaultToken = await vault.vaultToken()

    })

    it("Checks initial params", async () => {
        expect(await vault.name()).to.equal("Test Vault")
        expect(await vault.symbol()).to.equal("TEST")

        expect(vaultToken).to.not.equal("0x0000000000000000000000000000000000000000")

    })

});


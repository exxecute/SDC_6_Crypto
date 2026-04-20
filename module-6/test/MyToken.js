const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {

    let token;
    let owner;
    let addr1;

    const initialSupply = ethers.utils.parseEther("1000000");
    const mintAmount = ethers.utils.parseEther("500");
    const transferAmount = ethers.utils.parseEther("100");

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        const MyToken = await ethers.getContractFactory("MyToken");
        token = await MyToken.deploy(initialSupply);
        await token.deployed();
    });

    it("Should assign initial supply to owner", async function () {
        const balance = await token.balanceOf(owner.address);
        expect(balance.eq(initialSupply)).to.equal(true);
    });

    it("Owner should be able to mint tokens", async function () {
        await token.mint(addr1.address, mintAmount);

        const balance = await token.balanceOf(addr1.address);
        expect(balance.eq(mintAmount)).to.equal(true);
    });

    it("Should transfer tokens correctly", async function () {
        await token.transfer(addr1.address, transferAmount);

        const balance = await token.balanceOf(addr1.address);
        expect(balance.eq(transferAmount)).to.equal(true);
    });

    it("Should fail when transferring more than balance", async function () {
        let error = null;

        try {
            await token.connect(addr1).transfer(owner.address, transferAmount);
        } catch (e) {
            error = e;
        }

        if (!error) {
            throw new Error("Expected revert but transaction succeeded");
        }
    });

});
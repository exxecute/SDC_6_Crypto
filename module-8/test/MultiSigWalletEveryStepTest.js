const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSigWalletEveryStepTest", function () {

    let wallet;
    let owner1;
    let owner2;
    let owner3;
    let user;

    beforeEach(async function () {

        [owner1, owner2, owner3, user] =
            await ethers.getSigners();

        const MultiSigWallet =
            await ethers.getContractFactory("MultiSigWallet");

        wallet = await MultiSigWallet.deploy(
            [
                owner1.address,
                owner2.address,
                owner3.address
            ],
            2
        );

        await wallet.deployed();
    });

    // ------------------------------------------------
    // Constructor Tests
    // ------------------------------------------------

    it("Should set owners correctly", async function () {

        expect(
            await wallet.isOwner(owner1.address)
        ).to.equal(true);

        expect(
            await wallet.isOwner(owner2.address)
        ).to.equal(true);

        expect(
            await wallet.isOwner(owner3.address)
        ).to.equal(true);

    });

    it("Should set required confirmations", async function () {

        expect(
            (await wallet.required()).toNumber()
        ).to.equal(2);

    });

    // ------------------------------------------------
    // Deposit ETH
    // ------------------------------------------------

    it("Should receive ETH", async function () {

        await owner1.sendTransaction({
            to: wallet.address,
            value: ethers.utils.parseEther("1")
        });

        const balance =
            await ethers.provider.getBalance(wallet.address);

        expect(balance.toString()).to.equal(
            ethers.utils.parseEther("1").toString()
        );

    });

    // ------------------------------------------------
    // Submit Transaction
    // ------------------------------------------------

    it("Should submit transaction", async function () {

        await wallet.connect(owner1).submitTransaction(
            user.address,
            ethers.utils.parseEther("0.5"),
            "0x"
        );

        const count =
            await wallet.getTransactionCount();

        expect(count.toNumber()).to.equal(1);

    });

    // ------------------------------------------------
    // Confirm Transaction
    // ------------------------------------------------

    it("Should confirm transaction", async function () {

        await wallet.connect(owner1).submitTransaction(
            user.address,
            ethers.utils.parseEther("0.5"),
            "0x"
        );

        await wallet.connect(owner1)
            .confirmTransaction(0);

        const tx = await wallet.transactions(0);

        expect(
            tx.numConfirmations.toNumber()
        ).to.equal(1);

    });

    // ------------------------------------------------
    // Prevent Double Confirmation
    // ------------------------------------------------

    it("Should prevent double confirmation", async function () {

        await wallet.connect(owner1).submitTransaction(
            user.address,
            ethers.utils.parseEther("0.5"),
            "0x"
        );

        await wallet.connect(owner1)
            .confirmTransaction(0);

        let error = null;

        try {

            await wallet.connect(owner1)
                .confirmTransaction(0);

        } catch (err) {

            error = err;

        }

        expect(error).to.not.equal(null);

    });

    // ------------------------------------------------
    // Execute Transaction
    // ------------------------------------------------

    it("Should execute transaction after enough confirmations", async function () {

        // send ETH to contract
        await owner1.sendTransaction({
            to: wallet.address,
            value: ethers.utils.parseEther("1")
        });

        // submit tx
        await wallet.connect(owner1).submitTransaction(
            user.address,
            ethers.utils.parseEther("0.5"),
            "0x"
        );

        // confirmations
        await wallet.connect(owner1)
            .confirmTransaction(0);

        await wallet.connect(owner2)
            .confirmTransaction(0);

        // balance before
        const beforeBalance =
            await ethers.provider.getBalance(user.address);

        // execute tx
        await wallet.connect(owner1)
            .executeTransaction(0);

        // balance after
        const afterBalance =
            await ethers.provider.getBalance(user.address);

        expect(
            afterBalance.gt(beforeBalance)
        ).to.equal(true);

    });

    // ------------------------------------------------
    // Prevent Execute Without Confirmations
    // ------------------------------------------------

    it("Should not execute without enough confirmations", async function () {

        await owner1.sendTransaction({
            to: wallet.address,
            value: ethers.utils.parseEther("1")
        });

        await wallet.connect(owner1).submitTransaction(
            user.address,
            ethers.utils.parseEther("0.5"),
            "0x"
        );

        await wallet.connect(owner1)
            .confirmTransaction(0);

        let error = null;

        try {

            await wallet.connect(owner1)
                .executeTransaction(0);

        } catch (err) {

            error = err;

        }

        expect(error).to.not.equal(null);

    });

    // ------------------------------------------------
    // Revoke Confirmation
    // ------------------------------------------------

    it("Should revoke confirmation", async function () {

        await wallet.connect(owner1).submitTransaction(
            user.address,
            ethers.utils.parseEther("0.5"),
            "0x"
        );

        await wallet.connect(owner1)
            .confirmTransaction(0);

        await wallet.connect(owner1)
            .revokeConfirmation(0);

        const tx =
            await wallet.transactions(0);

        expect(
            tx.numConfirmations.toNumber()
        ).to.equal(0);

    });

});

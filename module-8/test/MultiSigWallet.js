const { expect } = require("chai");

describe("MultiSigWallet", function () {
  let wallet, owners;

  beforeEach(async () => {
    owners = await ethers.getSigners();

    const MultiSig = await ethers.getContractFactory("MultiSigWallet");

    wallet = await MultiSig.deploy(
      [owners[0].address, owners[1].address, owners[2].address],
      2
    );

    await wallet.deployed();
  });

  it("Deploys correctly", async () => {
    expect((await wallet.required()).toNumber()).to.equal(2);
  });

  it("Submits transaction", async () => {
    await wallet.submitTransaction(owners[3].address, 0, "0x");
    expect((await wallet.getTransactionCount()).toNumber()).to.equal(1);
  });

  it("Confirms transaction", async () => {
    await wallet.submitTransaction(owners[3].address, 0, "0x");

    await wallet.connect(owners[1]).confirmTransaction(0);

    const tx = await wallet.transactions(0);
    expect(tx.numConfirmations.toNumber()).to.equal(1);
  });

  it("Executes after enough confirmations", async () => {
    await wallet.submitTransaction(owners[3].address, 0, "0x");

    await wallet.confirmTransaction(0);
    await wallet.connect(owners[1]).confirmTransaction(0);

    await wallet.executeTransaction(0);

    const tx = await wallet.transactions(0);
    expect(tx.executed).to.equal(true);
  });

  it("Rejects non-owner", async () => {
  let errorCaught = false;

  try {
    await wallet
      .connect(owners[4])
      .submitTransaction(owners[3].address, 0, "0x");
  } catch (error) {
    errorCaught = true;
    expect(error.message).to.include("Not owner");
  }

  expect(errorCaught).to.equal(true);
});
});
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Homework Tests", function () {
  let Soulbound721, Game1155;
  let sbdContract, gameContract;
  let owner, student, externalUser;

  beforeEach(async function () {
    [owner, student, externalUser] = await ethers.getSigners();

    Soulbound721 = await ethers.getContractFactory("SoulboundVisitCardERC721");
    sbdContract = await Soulbound721.deploy(owner.address);

    Game1155 = await ethers.getContractFactory("GameCharacterCollectionERC1155");
    gameContract = await Game1155.deploy(owner.address, "./metadata/characters/");
  });

  describe("1. ERC-721 Soulbound Visit Card", function () {
    it("Should mint exactly one card to the student", async function () {
      await sbdContract.mintCard(student.address, 1, "./student_card.json");
      
      const balance = await sbdContract.balanceOf(student.address);
      expect(balance.toString()).to.equal("1");
      expect(await sbdContract.tokenURI(1)).to.equal("./student_card.json");
    });

    it("Should fail if trying to mint a second card to the same student", async function () {
      await sbdContract.mintCard(student.address, 1, "./student_card.json");
      
      try {
        await sbdContract.mintCard(student.address, 2, "./student_card.json");
        expect.fail("Transaction should have reverted");
      } catch (error) {
        expect(error.message).to.include("Student already has a visit card");
      }
    });

    it("Should ENFORCE soulbound behavior (fail on transfer attempt)", async function () {
      await sbdContract.mintCard(student.address, 1, "./student_card.json");
      
      try {
        await sbdContract.connect(student).transferFrom(student.address, externalUser.address, 1);
        expect.fail("Transaction should have reverted");
      } catch (error) {
        expect(error.message).to.include("Soulbound: Transfer failed");
      }
    });

    it("Should fail on approvals", async function () {
      await sbdContract.mintCard(student.address, 1, "./student_card.json");
      
      try {
        await sbdContract.connect(student).approve(externalUser.address, 1);
        expect.fail("Transaction should have reverted");
      } catch (error) {
        expect(error.message).to.include("Soulbound: Approval disabled");
      }
    });
  });

  describe("2. ERC-1155 Game Character Collection", function () {
    it("Should support batch minting of 10 distinct tokens", async function () {
      const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const amounts = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      
      await gameContract.mintBatch(owner.address, ids, amounts, "0x");
      
      const balance1 = await gameContract.balanceOf(owner.address, 1);
      const balance10 = await gameContract.balanceOf(owner.address, 10);
      
      expect(balance1.toString()).to.equal("1");
      expect(balance10.toString()).to.equal("1");
    });

    it("Should allow transferring 1 or 2 characters to the student", async function () {
      const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const amounts = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      await gameContract.mintBatch(owner.address, ids, amounts, "0x");

      await gameContract.safeTransferFrom(owner.address, student.address, 1, 1, "0x");
      
      const studentBalance = await gameContract.balanceOf(student.address, 1);
      const ownerBalance = await gameContract.balanceOf(owner.address, 1);

      expect(studentBalance.toString()).to.equal("1");
      expect(ownerBalance.toString()).to.equal("0");
    });

    it("Should return correct URI for each token identity", async function () {
      expect(await gameContract.uri(1)).to.equal("./metadata/characters/1.json");
      expect(await gameContract.uri(5)).to.equal("./metadata/characters/5.json");
    });
  });
});
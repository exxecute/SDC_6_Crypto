const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Деплоим ERC-721 (передаем адрес деплоера как initialOwner)
  const VisitCard = await ethers.getContractFactory("SoulboundVisitCardERC721");
  const visit = await VisitCard.deploy(deployer.address);
  await visit.deployed();

  // 2. Деплоим ERC-1155 (передаем initialOwner И путь к метаданным)
  const Game = await ethers.getContractFactory("GameCharacterCollectionERC1155");
  // Используем твой локальный путь к метаданным героев
  const game = await Game.deploy(deployer.address, "./metadata/characters/");
  await game.deployed();

  console.log("-----------------------------------------------");
  console.log("SUCCESS! Copy these addresses for your report:");
  console.log("Visit Card (ERC-721) address:", visit.address);
  console.log("Game Collection (ERC-1155) address:", game.address);
  console.log("-----------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
const hre = require("hardhat");

async function main() {
  const Greeting = await hre.ethers.getContractFactory("Greeting");

  const greeting = await Greeting.deploy("Uladzislau");

  await greeting.deployed();

  console.log("Deployed to:", greeting.address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  const MyToken = await hre.ethers.getContractFactory("MyToken");

  const initialSupply = hre.ethers.utils.parseEther("1000000");

  const token = await MyToken.deploy(initialSupply);

  await token.deployed();

  console.log("MyToken deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

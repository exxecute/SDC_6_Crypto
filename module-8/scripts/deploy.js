const hre = require("hardhat");

async function main() {
    const V1 = await hre.ethers.getContractFactory("TokenV1");
    const v1 = await V1.deploy();
    await v1.deployed();

    const Proxy = await hre.ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy(await v1.address);
    await proxy.deployed();

    console.log("V1:", await v1.address);
    console.log("Proxy:", await proxy.address);
}

main().catch(console.error);
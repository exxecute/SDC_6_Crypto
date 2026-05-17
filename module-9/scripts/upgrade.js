const hre = require("hardhat");

async function main() {
    const V2 = await hre.ethers.getContractFactory("TokenV2");
    const v2 = await V2.deploy();
    await v2.deployed();

    const proxyAddress = process.env.PROXY;

    const Proxy = await hre.ethers.getContractAt("Proxy", proxyAddress);

    const tx = await Proxy.upgrade(await v2.address);
    await tx.wait();

    console.log("Upgraded to V2:", await v2.address);
}

main().catch(console.error);
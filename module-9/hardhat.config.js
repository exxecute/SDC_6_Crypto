require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24"
      }
    ]
  },
  networks: {
    localhost: {
      url: process.env.NETWORK_URL
    }
  }
};

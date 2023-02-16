// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
  TokenFactory = await ethers.getContractFactory("MyToken");
  Token = await TokenFactory.deploy();
  const AssetFactory = await ethers.getContractFactory("web3Assets");
  console.log("Deploying contract...");
  const Asset = await AssetFactory.deploy(Token.address, 300);
  await Asset.deployed();
  console.log(`Deployed contract to: ${Asset.address}`);
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 80001 && process.env.API_KEY) {
    console.log("Waiting for block confirmations...");
    await Asset.deployTransaction.wait(6);
    await verify(Asset.address, [Token.address, 300]);
  }
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
};

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

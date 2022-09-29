const { ethers } = require("hardhat");

async function main() {
  const wlContract = await ethers.getContractFactory("Whitelist");

  const deployWlContract = await wlContract.deploy(10);

  await deployWlContract.deployed();

  console.log("Wl Contract Address:", deployWlContract.address);
}

main().then(()=> process.exit(0)).catch((error)=>{
    console.error(error);
    console.log("Log", error);
    process.exit(1);
})
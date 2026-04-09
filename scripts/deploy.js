import hre from "hardhat";

async function main() {
  console.log("Starting contract deployments...");

  // 1. Deploy DIDRegistry
  const DIDRegistry = await hre.ethers.getContractFactory("DIDRegistry");
  const didRegistry = await DIDRegistry.deploy();
  await didRegistry.waitForDeployment();
  const didRegistryAddress = await didRegistry.getAddress();
  console.log(`DIDRegistry deployed to: ${didRegistryAddress}`);

  // 2. Deploy CredentialStatus
  const CredentialStatus = await hre.ethers.getContractFactory("CredentialStatus");
  const credentialStatus = await CredentialStatus.deploy();
  await credentialStatus.waitForDeployment();
  const credentialStatusAddress = await credentialStatus.getAddress();
  console.log(`CredentialStatus deployed to: ${credentialStatusAddress}`);

  // 3. Deploy CredentialManager 
  const CredentialManager = await hre.ethers.getContractFactory("CredentialManager");
  const credentialManager = await CredentialManager.deploy(didRegistryAddress, credentialStatusAddress);
  await credentialManager.waitForDeployment();
  const credentialManagerAddress = await credentialManager.getAddress();
  console.log(`CredentialManager deployed to: ${credentialManagerAddress}`);

  console.log("\nDeployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
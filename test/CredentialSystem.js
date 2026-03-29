import { expect } from "chai";
import hre from "hardhat";

describe("Identity and Credential System", function () {
  let didRegistry, credentialStatus, credentialManager;
  let owner, user, institution;

  before(async function () {
    [owner, user, institution] = await hre.ethers.getSigners();

    // 1. Deploy DIDRegistry
    const DIDRegistry = await hre.ethers.getContractFactory("DIDRegistry");
    didRegistry = await DIDRegistry.deploy();

    // 2. Deploy CredentialStatus
    const CredentialStatus = await hre.ethers.getContractFactory("CredentialStatus");
    credentialStatus = await CredentialStatus.deploy();

    // 3. Deploy CredentialManager
    const CredentialManager = await hre.ethers.getContractFactory("CredentialManager");
    credentialManager = await CredentialManager.deploy(
      await didRegistry.getAddress(),
      await credentialStatus.getAddress()
    );
  });

  it("Should register a DID for the user and institution", async function () {
    await didRegistry.connect(user).registerDID(user.address, "pubKey_user", "endpoint_user");
    await didRegistry.connect(institution).registerDID(institution.address, "pubKey_inst", "endpoint_inst");

    const userDID = await didRegistry.getDID(user.address);
    expect(userDID.controller).to.equal(user.address);
  });

  it("Should allow an institution to issue a credential to a user", async function () {
    const ipfsHash = "QmTestHash12345";
    
    // Issue credential
    const tx = await credentialManager.connect(institution).issueCredential(user.address, ipfsHash);
    const receipt = await tx.wait();
    
    // Get the credentialHash from the emitted event
    const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'CredentialIssued');
    const credentialHash = event.args[0];

    // Verify it is active
    const isValid = await credentialManager.verifyCredential(credentialHash);
    expect(isValid).to.be.true;
  });
});
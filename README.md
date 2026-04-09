# University-Credential-System-Blockchain-

## <ins>Overview</ins>

This project implements a blockchain-based Identity and Access Management (IAM) system using smart contracts. The primary goals are to enable users to create decentralized identities (DIDs), allow institutions to issue verifiable credentials, and allow third parties to verify those credentials in a trustless manner.

## <ins>Architecture</ins>

* **DIDRegistry.sol**: Stores user identities, public keys, and service endpoints.
* **CredentialManager.sol**: Handles credential issuance and verification, linking DIDs to off-chain IPFS storage.
* **CredentialStatus.sol**: Manages credential revocation and active validity status.

## <ins>Technologies</ins>

* Solidity (v0.8.24)
* Hardhat
* Node.js (v20+)
* Ethereum
* IPFS (for off-chain storage)
* Ethers.js

## <ins>Workflow</ins>

1. **Identity Creation**: User and Issuer register their DIDs on the `DIDRegistry`.
2. **Issuance**: Issuer creates a credential (stored off-chain on IPFS) and calls `CredentialManager` to log it.
3. **Activation**: The smart contract stores the hash reference and marks it as valid in `CredentialStatus`.
4. **Verification**: A verifier checks authenticity and revocation status via the blockchain.

## <ins>Installation & Execution</ins>

### 1. Clone the repository

```bash
git clone [https://github.com/samm-47/University-Credential-System-Blockchain-.git](https://github.com/samm-47/University-Credential-System-Blockchain-.git)
cd University-Credential-System-Blockchain-
```

### 2. Install Dependencies

Ensure you have Node v20 or higher installed, then install the required packages:

```bash
npm install
```

### 3. Compilation & Testing

Compile the smart contracts and run the automated test suite to verify the logic:

```bash
npx hardhat compile
npx hardhat test
```

**Expected Output:**
```text
$ npx hardhat compile
Downloading compiler 0.8.24
Compiled 3 Solidity files successfully (evm target: paris).

$ npx hardhat test
  Identity and Credential System
    ✔ Should register a DID for the user and institution
    ✔ Should allow an institution to issue a credential to a user

  2 passing (360ms)
```

### 4. Running a Local Node & Deploying

To simulate a live blockchain environment locally and deploy the smart contracts:

**Step 1: Start the local blockchain**
Open a dedicated terminal and spin up a local Hardhat node:
```bash
npx hardhat node
```

**Step 2: Deploy the contracts**
Leave the node running, open a second terminal, and execute the deployment script:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Expected Deployment Output:**
```text
Starting contract deployments...
DIDRegistry deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
CredentialStatus deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
CredentialManager deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

Deployment complete!
```

### 5. Deploying to a Public Testnet (Sepolia)

To deploy outside your local machine, create an `.env` file in the root directory:

```env
SEPOLIA_RPC_URL=your_rpc_url_here
PRIVATE_KEY=your_wallet_private_key_here
```

Deploy using:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
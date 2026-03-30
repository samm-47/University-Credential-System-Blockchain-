# University-Credential-System-Blockchain-

## <ins>Overview</ins>

This project demonstrates a decentralized identity and credential system 
for educational institutions. Universities can issue verifiable digital 
credentials that students can own, control, and share with employers or 
third parties without relying on centralized credential verification services.

**Key Benefits:**
- Tamper-proof credentials stored on the blockchain
- Students retain full control of their credentials
- Instant verification without contacting the issuing institution
- Reduced fraud in credential verification processes

## <ins>Architecture</ins>

* **DIDRegistry.sol**: Stores user identities, public keys, and service endpoints.
* **CredentialManager.sol**: Handles credential issuance and verification, linking DIDs to off-chain IPFS storage.
* **CredentialStatus.sol**: Manages credential revocation and active validity status.

## <ins>Technologies</ins>

* Solidity (v0.8.24)
* Hardhat
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
git clone https://github.com/samm-47/University-Credential-System-Blockchain-.git
cd University-Credential-System-Blockchain-
```

### 2. Install Dependencies
Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
Install the required Node.js packages and Hardhat environment:
```bash
npm install
npm install dotenv @nomicfoundation/hardhat-toolbox
```

### 3. Running the Network & Tests

We utilize `npm` scripts to bypass global versioning issues with `npx`. Ensure your `package.json` includes the following in the `"scripts"` block:
```json
"scripts": {
  "node": "hardhat node",
  "compile": "hardhat compile",
  "deploy:local": "hardhat run scripts/deploy.js --network localhost",
  "test": "hardhat test"
}
```

**Start the local blockchain:**
Open a dedicated terminal and run:
```bash
npm run node
```

**Compile and Test:**
In a separate terminal, compile the smart contracts and run the automated test suite (you can also use `npx hardhat` directly):
```bash
npx hardhat compile
npx hardhat test
```

**Expected Output:**
```
$ npx hardhat compile
Downloading compiler 0.8.24
Compiled 3 Solidity files successfully (evm target: paris).

$ npx hardhat test
  Identity and Credential System
    ✔ Should register a DID for the user and institution
    ✔ Should allow an institution to issue a credential to a user

  2 passing (360ms)
```

**Deploy Locally:**
Deploy the architecture to your local Hardhat node:
```bash
npm run deploy:local
```

### 4. Deploying to a Public Testnet (Sepolia)

To deploy outside your local machine, create an `.env` file in the root directory:

```
SEPOLIA_RPC_URL=your_rpc_url_here
PRIVATE_KEY=your_wallet_private_key_here
```

Deploy using:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

# University-Credential-System-Blockchain-

## <ins>Overview</ins>

This project implements a blockchain-based Identity and Access Management (IAM) system using smart contracts. The primary goals are to enable users to create decentralized identities (DIDs), allow institutions to issue verifiable credentials, and allow third parties to verify those credentials in a trustless manner.

## <ins>Architecture</ins>

* DIDRegistry.sol (Stores user identities and public keys)

* CredentialManager.sol (Handles credential issuance and verification)

* CredentialStatus.sol: (Manages credential revocation and validity)

## <ins>Technologies</ins>

* Solidity

* Hardhat

* Ethereum

* IPFS (for off-chain storage)

* Ethers.js

## <ins>Workflow</ins>

1. User registers DID

2. Issuer creates credential (stored on IPFS)

2. Smart contract stores hash reference

4. Verifier checks authenticity via blockchain

## <ins>Installation & Execution</ins>

### 1. Clone the repository

```bash
git clone https://github.com/samm-47/University-Credential-System-Blockchain-.git
cd University-Credential-System-Blockchain-
```

### 2. Install Node.js dependencies

This project is structured as a Hardhat project, so install Node.js dependencies first.

```bash
npm install
```

If the project does not already include a `package.json`, initialize one and install the common Hardhat dependencies:

```bash
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### 3. Start a local blockchain

Run a local Hardhat node in a separate terminal:

```bash
npx hardhat node
```

This starts a local Ethereum development network, usually at `http://127.0.0.1:8545`.

### 4. Compile the smart contracts

In another terminal, compile the contracts:

```bash
npx hardhat compile
```

### 5. Deploy the contracts

Use the deployment script to deploy to the local Hardhat network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 6. Test or interact with the contracts

After deployment, you can add tests inside a `test/` folder and run them with:

```bash
npx hardhat test
```

You can also use the Hardhat console to interact with deployed contracts:

```bash
npx hardhat console --network localhost
```

### 7. Optional: deploy to a public testnet

To deploy outside your local machine, add an RPC URL and wallet private key to an `.env` file, then update `hardhat.config.js` to use that network.

Example:

```env
SEPOLIA_RPC_URL=your_rpc_url_here
PRIVATE_KEY=your_wallet_private_key_here
```

Then deploy with a command like:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Current project status

At the moment, parts of this repository are still scaffolded or incomplete (for example, some contract files, `hardhat.config.js`, and `scripts/deploy.js` are placeholders). That means the commands above describe the intended way to run the project, but the missing implementation files need to be completed before compilation and deployment will work successfully.

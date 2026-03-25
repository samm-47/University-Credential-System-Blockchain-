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

# ADD HERE

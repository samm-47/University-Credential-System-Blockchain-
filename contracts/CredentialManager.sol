// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "./DIDRegistry.sol";
import "./CredentialStatus.sol";

/// @title Credential Manager Contract
/// @notice Handles the issuance of credentials and off-chain IPFS references
/// @dev This contract links the registered DIDs to off-chain credential data stored on IPFS,
///      then it delegates validity and revocation checks to the CredentialStatus contract.
contract CredentialManager {
    // Used to confirm registered identities and manage credential validity
    DIDRegistry public didRegistry;
    CredentialStatus public credentialStatus;

    struct Credential {
        address issuer;
        address subject;
        string ipfsHash; // Off-chain storage reference
    }

    // Stores the issued credentials using their unique credential hashes
    mapping(bytes32 => Credential) public credentials;

    event CredentialIssued(bytes32 indexed credentialHash, address indexed issuer, address indexed subject, string ipfsHash);

    // Connects this contract to the DIDRegistry and CredentialStatus contracts
    constructor(address _didRegistryAddress, address _credentialStatusAddress) {
        didRegistry = DIDRegistry(_didRegistryAddress);
        credentialStatus = CredentialStatus(_credentialStatusAddress);
    }

    /// @notice Issues a new credential referencing an IPFS hash
    function issueCredential(address _subject, string memory _ipfsHash) external returns (bytes32) {
        // Ensure both issuer and subject have registered DIDs
        (address issuerController, , ) = didRegistry.getDID(msg.sender);
        (address subjectController, , ) = didRegistry.getDID(_subject);
        require(issuerController != address(0) && subjectController != address(0), "Both parties must have registered DIDs");

        // Generate a unique hash for the credential
        bytes32 credentialHash = keccak256(abi.encodePacked(msg.sender, _subject, _ipfsHash, block.timestamp));
        
        // Saves the credential details on-chain while the full credential stays stored on IPFS
        credentials[credentialHash] = Credential({
            issuer: msg.sender,
            subject: _subject,
            ipfsHash: _ipfsHash
        });

        // Mark the credential as valid in the CredentialStatus contract
        credentialStatus.activateCredential(credentialHash);

        emit CredentialIssued(credentialHash, msg.sender, _subject, _ipfsHash);
        return credentialHash;
    }

    /// @notice Checks if a credential is active and valid
    function verifyCredential(bytes32 _credentialHash) external view returns (bool) {
        // Checks the credential's current status using CredentialStatus contract
        return credentialStatus.checkStatus(_credentialHash);
    }
}
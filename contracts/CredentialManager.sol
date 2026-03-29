// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "./DIDRegistry.sol";
import "./CredentialStatus.sol";

/// @title Credential Manager Contract
/// @notice Handles the issuance of credentials and off-chain IPFS references
contract CredentialManager {
    DIDRegistry public didRegistry;
    CredentialStatus public credentialStatus;

    struct Credential {
        address issuer;
        address subject;
        string ipfsHash; // Off-chain storage reference
    }

    mapping(bytes32 => Credential) public credentials;

    event CredentialIssued(bytes32 indexed credentialHash, address indexed issuer, address indexed subject, string ipfsHash);

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
        
        credentials[credentialHash] = Credential({
            issuer: msg.sender,
            subject: _subject,
            ipfsHash: _ipfsHash
        });

        // Mark the credential as valid
        credentialStatus.activateCredential(credentialHash);

        emit CredentialIssued(credentialHash, msg.sender, _subject, _ipfsHash);
        return credentialHash;
    }

    /// @notice Verifies if a credential is mathematically authentic and legally valid
    function verifyCredential(bytes32 _credentialHash) external view returns (bool) {
        return credentialStatus.checkStatus(_credentialHash);
    }
}
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

/// @title Credential Status Contract
/// @notice Manages the validity and revocation status of verifiable credentials
contract CredentialStatus {
    mapping(bytes32 => bool) public isRevoked;
    mapping(bytes32 => bool) public isValid;

    event CredentialRevoked(bytes32 indexed credentialHash);
    event CredentialActivated(bytes32 indexed credentialHash);

    /// @notice Activates a newly minted credential
    function activateCredential(bytes32 _credentialHash) external {
        // Note: In a production environment, you should add access control 
        // (e.g., only the CredentialManager or the specific issuer can call this)
        isValid[_credentialHash] = true;
        isRevoked[_credentialHash] = false;
        emit CredentialActivated(_credentialHash);
    }

    /// @notice Revokes a previously issued credential
    function revokeCredential(bytes32 _credentialHash) external {
        // Note: Similarly, restrict this to the issuer
        isRevoked[_credentialHash] = true;
        isValid[_credentialHash] = false;
        emit CredentialRevoked(_credentialHash);
    }

    /// @notice Checks if a credential is valid and not revoked
    function checkStatus(bytes32 _credentialHash) external view returns (bool) {
        return isValid[_credentialHash] && !isRevoked[_credentialHash];
    }
}
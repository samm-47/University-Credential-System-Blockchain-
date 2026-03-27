// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

/// @title DID Registry Contract
/// @notice This contract will manage decentralized identifiers and the public keys
contract DIDRegistry {

    struct DID {
            address owner;
            string publicKey;
            bool exists;
        }




}

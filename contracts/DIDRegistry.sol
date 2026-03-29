// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

/// @title DID Registry Contract
/// @notice This contract will manage decentralized identifiers and the public keys
contract DIDRegistry {

    struct DID {
            address controller;
            string publicKey;
            string serviceEndpoint;
            bool exists;
        }

    mapping(address => DID) public dids;

    // This allows off-chain tools to track changes
    event DIDRegistered(address indexed identity, address controller, string publicKey);
    event DIDUpdated(address indexed identity, string newServiceEndpoint);

    /// @notice Register a DID with controller and service info
    function registerDID(address _controller, string memory _publicKey, string memory _endpoint) public {
        require(!dids[msg.sender].exists, "DID already exists");

        dids[msg.sender] = DID(_controller, _publicKey, _endpoint, true);
        
        emit DIDRegistered(msg.sender, _controller, _publicKey);
    }

    /// @notice Update the service endpoint (only by the controller)
    function updateService(address _identity, string memory _newEndpoint) public {
        require(dids[_identity].exists, "DID does not exist");
        require(msg.sender == dids[_identity].controller, "Not authorized");

        dids[_identity].serviceEndpoint = _newEndpoint;
        
        emit DIDUpdated(_identity, _newEndpoint);
    }

    function getDID(address _user) public view returns (address controller, string memory pubKey, string memory endpoint) {
        require(dids[_user].exists, "DID does not exist");
        DID storage d = dids[_user];
        return (d.controller, d.publicKey, d.serviceEndpoint);
    }
}

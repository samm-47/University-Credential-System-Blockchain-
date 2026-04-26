import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

import DIDRegistryJSON from './contracts/DIDRegistry.json';
import CredentialStatusJSON from './contracts/CredentialStatus.json';
import CredentialManagerJSON from './contracts/CredentialManager.json';

function App() {
  const [logs, setLogs] = useState([]);
  const [deployedAddresses, setDeployedAddresses] = useState({ did: "", status: "", manager: "" });
  
  // Input Form States
  const [didInput, setDidInput] = useState({ controller: "", publicKey: "", endpoint: "" });
  const [issueInput, setIssueInput] = useState({ subject: "", ipfsHash: "" });

  const logEndRef = useRef(null);

  // Constants for Local Node
  const RPC_URL = "http://127.0.0.1:8545";
  const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // --- 1. DEPLOYMENT LOGIC ---
  const deployAll = async () => {
    try {
      setLogs([]);
      addLog("Initializing Deployment Sequence...");
      
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      let currentNonce = await provider.getTransactionCount(wallet.address, "pending");

      // Deploy DID Registry
      addLog("Deploying DIDRegistry...");
      const DIDFactory = new ethers.ContractFactory(DIDRegistryJSON.abi, DIDRegistryJSON.bytecode, wallet);
      const didContract = await DIDFactory.deploy({ nonce: currentNonce++ });
      await didContract.waitForDeployment();
      const didAddr = await didContract.getAddress();
      addLog(`✔ DIDRegistry: ${didAddr}`);

      // Deploy Status
      addLog("Deploying CredentialStatus...");
      const StatusFactory = new ethers.ContractFactory(CredentialStatusJSON.abi, CredentialStatusJSON.bytecode, wallet);
      const statusContract = await StatusFactory.deploy({ nonce: currentNonce++ });
      await statusContract.waitForDeployment();
      const statusAddr = await statusContract.getAddress();
      addLog(`✔ CredentialStatus: ${statusAddr}`);

      // Deploy Manager
      addLog("Deploying CredentialManager...");
      const ManagerFactory = new ethers.ContractFactory(CredentialManagerJSON.abi, CredentialManagerJSON.bytecode, wallet);
      const managerContract = await ManagerFactory.deploy(didAddr, statusAddr, { nonce: currentNonce++ });
      await managerContract.waitForDeployment();
      const managerAddr = await managerContract.getAddress();
      addLog(`✔ CredentialManager: ${managerAddr}`);

      setDeployedAddresses({ did: didAddr, status: statusAddr, manager: managerAddr });
      addLog("✔ SYSTEM ONLINE. You can now use the forms.");
    } catch (e) { addLog(`❌ DEPLOY ERROR: ${e.message}`); }
  };

  // --- 2. INTERACTION LOGIC ---
  const handleRegisterDID = async () => {
    try {
      addLog("Calling registerDID...");
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(deployedAddresses.did, DIDRegistryJSON.abi, wallet);

      const tx = await contract.registerDID(didInput.controller, didInput.publicKey, didInput.endpoint);
      addLog(`Tx Sent: ${tx.hash}`);
      await tx.wait();
      addLog("✅ DID successfully registered in blockchain.");
    } catch (e) { addLog(`❌ DID ERROR: ${e.message}`); }
  };

  const handleIssueCredential = async () => {
    try {
      addLog("Calling issueCredential...");
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(deployedAddresses.manager, CredentialManagerJSON.abi, wallet);

      const tx = await contract.issueCredential(issueInput.subject, issueInput.ipfsHash);
      addLog(`Tx Sent: ${tx.hash}`);
      await tx.wait();
      addLog("✅ Credential issued and linked to DID status.");
    } catch (e) { addLog(`❌ ISSUE ERROR: ${e.message}`); }
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2>Control Panel</h2>
        <button onClick={deployAll} style={deployBtnStyle}>1. Deploy System</button>
        
        {deployedAddresses.did && (
          <>
            <div style={formCardStyle}>
              <h4>Register DID</h4>
              <input placeholder="Controller Address" onChange={e => setDidInput({...didInput, controller: e.target.value})} style={inputStyle} />
              <input placeholder="Public Key String" onChange={e => setDidInput({...didInput, publicKey: e.target.value})} style={inputStyle} />
              <input placeholder="Endpoint URL" onChange={e => setDidInput({...didInput, endpoint: e.target.value})} style={inputStyle} />
              <button onClick={handleRegisterDID} style={actionBtnStyle}>Submit to Chain</button>
            </div>

            <div style={formCardStyle}>
              <h4>Issue Credential</h4>
              <input placeholder="Subject Address" onChange={e => setIssueInput({...issueInput, subject: e.target.value})} style={inputStyle} />
              <input placeholder="IPFS Hash (CID)" onChange={e => setIssueInput({...issueInput, ipfsHash: e.target.value})} style={inputStyle} />
              <button onClick={handleIssueCredential} style={actionBtnStyle}>Sign & Issue</button>
            </div>
          </>
        )}
      </div>

      <div style={mainContentStyle}>
        <div style={terminalHeader}>Live Blockchain Node Logs</div>
        <div style={terminalBody}>
          {logs.map((log, i) => <div key={i} style={{marginBottom: '4px'}}>{log}</div>)}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const containerStyle = { display: 'flex', height: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'monospace' };
const sidebarStyle = { width: '350px', padding: '20px', borderRight: '1px solid #333', overflowY: 'auto' };
const mainContentStyle = { flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' };

const terminalHeader = { backgroundColor: '#333', padding: '10px', fontSize: '12px', color: '#aaa', borderRadius: '5px 5px 0 0' };
const terminalBody = { flex: 1, backgroundColor: '#000', padding: '20px', color: '#00ff00', overflowY: 'auto', fontSize: '14px', border: '1px solid #333' };

const formCardStyle = { backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #333' };
const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', backgroundColor: '#2b2b2b', border: '1px solid #444', color: '#fff', boxSizing: 'border-box' };

const deployBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const actionBtnStyle = { width: '100%', padding: '10px', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default App;
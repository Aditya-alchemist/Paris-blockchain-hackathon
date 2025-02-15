import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const contractAddress = "0xA2DdB1c2Cbfb6bcc870C1925d8AB8C6e3b24E63a";
const contractABI = [
  "function mintCarbonCredit(address to, uint256 credits, string calldata verification) external",
  "function authorizeMinter(address account) external",
  "function revokeMinter(address account) external",
  "function retireCarbonCredit(uint256 tokenId) external",
  "function tradeCarbonCredit(address to, uint256 tokenId) external",
  "function getCredits(uint256 tokenId) external view returns (uint256)",
  "function getVerificationData(uint256 tokenId) external view returns (string memory)",
  "function isRetired(uint256 tokenId) external view returns (bool)",
  "function tokenCounter() external view returns (uint256)",
  "function owner() external view returns (address)",
  "function minters(address) external view returns (bool, uint256)"
];

function App() {
  const [account, setAccount] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Form States
  const [mintForm, setMintForm] = useState({
    recipient: '',
    credits: '',
    verification: ''
  });
  
  const [tradeForm, setTradeForm] = useState({
    recipient: '',
    tokenId: ''
  });
  
  const [retireForm, setRetireForm] = useState({
    tokenId: ''
  });
  
  const [verifyForm, setVerifyForm] = useState({
    tokenId: '',
    verificationData: ''
  });

  const [authorityForm, setAuthorityForm] = useState({
    address: ''
  });

  const [revokeForm, setRevokeForm] = useState({
    address: ''
  });

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const ownerAddress = await contract.owner();
        setIsOwner(accounts[0].toLowerCase() === ownerAddress.toLowerCase());
      } else {
        showAlert('Please install MetaMask!', 'error');
      }
    } catch (error) {
      showAlert('Failed to connect wallet: ' + error.message, 'error');
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      showAlert('Please connect your wallet first!', 'error');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.mintCarbonCredit(
        mintForm.recipient,
        mintForm.credits,
        mintForm.verification
      );
      await tx.wait();
      showAlert('Successfully minted carbon credit NFT!', 'success');
      setMintForm({ recipient: '', credits: '', verification: '' });
    } catch (error) {
      showAlert('Failed to mint: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      showAlert('Please connect your wallet first!', 'error');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.tradeCarbonCredit(tradeForm.recipient, tradeForm.tokenId);
      await tx.wait();
      showAlert('Successfully traded token ' + tradeForm.tokenId, 'success');
      setTradeForm({ recipient: '', tokenId: '' });
    } catch (error) {
      showAlert('Failed to trade token: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const handleRetire = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      showAlert('Please connect your wallet first!', 'error');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.retireCarbonCredit(retireForm.tokenId);
      await tx.wait();
      showAlert('Successfully retired token ' + retireForm.tokenId, 'success');
      setRetireForm({ tokenId: '' });
    } catch (error) {
      showAlert('Failed to retire token: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      showAlert('Please connect your wallet first!', 'error');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const credits = await contract.getCredits(verifyForm.tokenId);
      const verificationData = await contract.getVerificationData(verifyForm.tokenId);
      const isRetired = await contract.isRetired(verifyForm.tokenId);

      showAlert(`Token ${verifyForm.tokenId}:
        Credits: ${credits}
        Verification: ${verificationData}
        Retired: ${isRetired}`, 'success');
      setVerifyForm({ tokenId: '', verificationData: '' });
    } catch (error) {
      showAlert('Failed to verify token: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const handleAuthorize = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      showAlert('Please connect your wallet first!', 'error');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.authorizeMinter(authorityForm.address);
      await tx.wait();
      showAlert('Successfully authorized minter: ' + authorityForm.address, 'success');
      setAuthorityForm({ address: '' });
    } catch (error) {
      showAlert('Failed to authorize minter: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const handleRevoke = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      showAlert('Please connect your wallet first!', 'error');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.revokeMinter(revokeForm.address);
      await tx.wait();
      showAlert('Successfully revoked minter: ' + revokeForm.address, 'success');
      setRevokeForm({ address: '' });
    } catch (error) {
      showAlert('Failed to revoke minter: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const checkMinterStatus = async (address) => {
    if (!isConnected) {
      showAlert('Please connect your wallet first!', 'error');
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const [isAuthorized, mintedAmount] = await contract.minters(address);
      showAlert(`Address ${address}:
        Authorized: ${isAuthorized}
        Total Minted: ${mintedAmount}`, 'success');
    } catch (error) {
      showAlert('Failed to check minter status: ' + error.message, 'error');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Carbon Credit NFT Platform</h1>
        <button onClick={connectWallet} className="connect-button">
          {isConnected ? `Connected: ${account.slice(0,6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </header>

      {alert.show && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
          <button onClick={() => setAlert({ show: false, message: '', type: '' })}>×</button>
        </div>
      )}

      <main>
        <section className="form-section">
          <h2>Mint Carbon Credit</h2>
          <form onSubmit={handleMint}>
            <input
              type="text"
              placeholder="Recipient Address"
              value={mintForm.recipient}
              onChange={(e) => setMintForm({...mintForm, recipient: e.target.value})}
            />
            <input
              type="number"
              placeholder="Credits Amount"
              value={mintForm.credits}
              onChange={(e) => setMintForm({...mintForm, credits: e.target.value})}
            />
            <input
              type="text"
              placeholder="Verification Data"
              value={mintForm.verification}
              onChange={(e) => setMintForm({...mintForm, verification: e.target.value})}
            />
            <button type="submit" disabled={loading || !isConnected}>
              {loading ? 'Processing...' : 'Mint NFT'}
            </button>
          </form>
        </section>

        <section className="form-section">
          <h2>Trade Carbon Credit</h2>
          <form onSubmit={handleTrade}>
            <input
              type="text"
              placeholder="Recipient Address"
              value={tradeForm.recipient}
              onChange={(e) => setTradeForm({...tradeForm, recipient: e.target.value})}
            />
            <input
              type="number"
              placeholder="Token ID"
              value={tradeForm.tokenId}
              onChange={(e) => setTradeForm({...tradeForm, tokenId: e.target.value})}
            />
            <button type="submit" disabled={loading || !isConnected}>
              {loading ? 'Processing...' : 'Trade Token'}
            </button>
          </form>
        </section>

        <section className="form-section">
          <h2>Retire Carbon Credit</h2>
          <form onSubmit={handleRetire}>
            <input
              type="number"
              placeholder="Token ID"
              value={retireForm.tokenId}
              onChange={(e) => setRetireForm({...retireForm, tokenId: e.target.value})}
            />
            <button type="submit" disabled={loading || !isConnected}>
              {loading ? 'Processing...' : 'Retire Token'}
            </button>
          </form>
        </section>

        <section className="form-section">
          <h2>Verify Carbon Credit</h2>
          <form onSubmit={handleVerify}>
            <input
              type="number"
              placeholder="Token ID"
              value={verifyForm.tokenId}
              onChange={(e) => setVerifyForm({...verifyForm, tokenId: e.target.value})}
            />
            <button type="submit" disabled={loading || !isConnected}>
              {loading ? 'Processing...' : 'Verify Token'}
            </button>
          </form>
        </section>

        {isOwner && (
          <>
            <section className="form-section">
              <h2>Authorize Minter</h2>
              <form onSubmit={handleAuthorize}>
                <input
                  type="text"
                  placeholder="Minter Address"
                  value={authorityForm.address}
                  onChange={(e) => setAuthorityForm({...authorityForm, address: e.target.value})}
                />
                <button type="submit" disabled={loading || !isConnected}>
                  {loading ? 'Processing...' : 'Authorize Minter'}
                </button>
              </form>
            </section>

            <section className="form-section">
              <h2>Revoke Minter</h2>
              <form onSubmit={handleRevoke}>
                <input
                  type="text"
                  placeholder="Minter Address"
                  value={revokeForm.address}
                  onChange={(e) => setRevokeForm({...revokeForm, address: e.target.value})}
                />
                <button type="submit" disabled={loading || !isConnected}>
                  {loading ? 'Processing...' : 'Revoke Minter'}
                </button>
                <button 
                  type="button" 
                  onClick={() => checkMinterStatus(revokeForm.address)}
                  disabled={!revokeForm.address || !isConnected}
                >
                  Check Status
                </button>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
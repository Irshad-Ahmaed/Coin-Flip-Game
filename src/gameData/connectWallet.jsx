import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CoinFlip from './CoinflipLogic';

const WalletConnection = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [show, setShow] = useState("");
  const [isHide, setIsHide] = useState(false);

  useEffect(()=>{
    
  },[balance])

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0].slice(0,10));
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));
        setShow('bg-gray-200');
        setIsHide(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this app.');
    }
  };

  return (
    <div className='md:flex gap-10'>
        <div className={`flex flex-col rounded-xl items-center p-4 ${show}`}>
            <button
                onClick={connectWallet}
                className={`${account != null ? 'bg-green-500' : 'bg-blue-500'} text-white px-4 py-2 rounded hover:bg-blue-700`}
            >
                {account != null ? "Connected" : "Connect Wallet"}
            </button>
            {account && <p className="mt-2 text-green-600">Connected: {account}...</p>}
            {balance && <p className="mt-2 text-yellow-600">Balance: {balance} ETH</p>}
        </div>

        {
            isHide &&
            <CoinFlip />
        }
    </div>
  );
};

export default WalletConnection;

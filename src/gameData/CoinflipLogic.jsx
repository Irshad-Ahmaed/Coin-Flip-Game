import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CoinFlipABI from './CoinFlipABI.json'; // Import the ABI of the contract

const CoinFlip = () => {
  const [betAmount, setBetAmount] = useState('');
  const [selectedSide, setSelectedSide] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [winning, setWinning] = useState(0);

  useEffect(()=>{

  },[winning, result, betAmount])

  const contractAddress = '0x87e10b37a5a0db198d4ef42d424cd1f5e3f5aa0c'; // Replace with your deployed contract address

  const flipCoin = async () => {
    if (!betAmount || !selectedSide) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, CoinFlipABI, signer);

    try {
      setLoading(true);
      const tx = await contract.flipCoin(selectedSide === 'heads', {
        value: ethers.utils.parseEther(betAmount),
      });
      await tx;
      const outcomes = (Math.random() < 0.5 ? 1 : 0);
      outcomes && await contract.flipCoin(selectedSide === 'heads');
      setResult(outcomes ? 'You won!' : 'You lost! Loose Nothing');
      outcomes ? setWinning(winning + Number(betAmount) + Number(betAmount)) : setWinning(winning);
    } catch (error) {
      console.error(error);
      setResult('Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Coin Flip Game</h2> */}
      <h2 className="text-2xl font-bold mb-4">Your Winning Amount: {winning}</h2>
      <input
        type="number"
        placeholder="Bet Amount in ETH"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        className="border p-2 mb-4"
      />
      <select
        onChange={(e) => setSelectedSide(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="">Select Side</option>
        <option value="heads">Heads</option>
        <option value="tails">Tails</option>
      </select>
      <button
        onClick={flipCoin}
        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? 'Flipping...' : 'Flip Coin'}
      </button>
      {loading && (
        <div className="mt-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}
      {result && <p className="mt-4">{result}</p>}
    </div>
  );
};

export default CoinFlip;
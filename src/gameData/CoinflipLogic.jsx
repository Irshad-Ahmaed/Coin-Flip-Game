import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CoinFlipABI from './CoinFlipABI.json'; // Import the ABI of the contract

const CoinFlip = () => {
  const [betAmount, setBetAmount] = useState('');
  const [selectedSide, setSelectedSide] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [winning, setWinning] = useState(0);
  const [wonAmount, setWonAmount] = useState();
  console.log(wonAmount);

  useEffect(()=>{

  },[winning, result, betAmount])

  const contractAddress = '0xe6f0394306d42458724aaa559d2ddd48416d2af6'; // Replace with your deployed contract address

  const flipCoin = async () => {
    if (!betAmount || !selectedSide) return;

    setWonAmount();
    setResult(null);
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
      setResult(outcomes ? 'You won! Collect your double bet' : 'You lost! Loose Nothing');
      outcomes && await contract.flipCoin(selectedSide === 'heads');
      outcomes ? setWinning(winning + Number(betAmount) + Number(betAmount)) : setWinning(winning);
      outcomes && setWonAmount(winning);
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
        placeholder="Amount > 0.00x ETH"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        className="border p-2 mb-4 rounded-md"
      />
      <select
        onChange={(e) => setSelectedSide(e.target.value)}
        className="border p-2 mb-4 rounded-md"
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
      {/* {result && <p className="mt-4">{result}</p>} */}
      {wonAmount == 0 ? <p className="mt-4">Double bet collected!</p> : result && <p className="mt-4">{result}</p>}
    </div>
  );
};

export default CoinFlip;
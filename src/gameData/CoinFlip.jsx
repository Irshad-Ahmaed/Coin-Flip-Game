import React, { useState } from "react";
import { ethers } from "ethers";

const CoinFlip = () => {
    const [walletConnected, setWalletConnected] = useState(false);
    const [account, setAccount] = useState("");
    const [betAmount, setBetAmount] = useState("");
    const [side, setSide] = useState("heads");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [winnings, setWinnings] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
                setWalletConnected(true);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("MetaMask not detected! Please install MetaMask.");
        }
    };

    const flipCoin = async () => {
        if (!betAmount || isNaN(betAmount) || parseFloat(betAmount) <= 0) {
            alert("Please enter a valid bet amount.");
            return;
        }

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractAddress = "0x87e10b37a5a0db198d4ef42d424cd1f5e3f5aa0c"; // Replace with your deployed contract address
            const contractABI = [
                "function flip(bool _choice) public payable returns (bool)",
                "event FlipResult(bool outcome)"
            ];

            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            try {
                setLoading(true);
                setResult(null);
                setWinnings(null);

                // Call the flip function on the contract
                const tx = await contract.flip(side === "heads", { value: ethers.utils.parseEther(betAmount) });
                const receipt = await tx;
                console.log(receipt)

                // Extract the outcome from the events
                let outcome = null;
                if (receipt && receipt.events) {
                    const event = receipt.events.find(event => event.event === 'FlipResult');
                    if (event && event.args) {
                        outcome = event.args[0];
                    }
                }

                const doubledAmount = ethers.utils.formatEther(ethers.utils.parseEther(betAmount).mul(2));

                if (outcome) {
                    setResult("Heads");
                    setWinnings(doubledAmount);
                } else {
                    setResult("Tails");
                }
            } catch (error) {
                console.error("Error during transaction:", error);
                setResult("Error");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 sm:p-6 md:p-8">
            <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full">
                {!walletConnected ? (
                    <button
                        onClick={connectWallet}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <div>
                        <p className="text-gray-300 mb-4 break-all">Wallet Connected: {account}</p>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">
                                Bet Amount (ETH):
                                <input
                                    type="text"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded mt-1"
                                    placeholder="0.01"
                                />
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">
                                Choose Side:
                                <select
                                    onChange={(e) => setSide(e.target.value)}
                                    value={side}
                                    className="w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded mt-1"
                                >
                                    <option value="heads">Heads</option>
                                    <option value="tails">Tails</option>
                                </select>
                            </label>
                        </div>
                        <button
                            onClick={flipCoin}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Flip Coin"}
                        </button>
                    </div>
                )}
                {result && !loading && (
                    <p className="mt-4 text-center">
                        {`The result is: ${result}`}
                        {winnings && result === "Heads" && <span>{`. You won ${winnings} ETH!`}</span>}
                        {result === "Tails" && !winnings && <span>{`. Better luck next time!`}</span>}
                    </p>
                )}
                {loading && (
                    <div className="mt-4 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p>Waiting for transaction to complete...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoinFlip;

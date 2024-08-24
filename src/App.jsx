import React, { useState } from 'react';
import WalletConnection from './gameData/connectWallet';
// import CoinFlip from './gameData/CoinflipLogic';

const App = () => {
  // const [accountAvailable, setAccountAvailable] = useState(false);

  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Coin Flip Game</h1>
      <WalletConnection />
    </div>
    </>
  );
};

export default App;

import React from 'react';
import { WalletContext } from '@contexts/walletContext';

const Menu = () => {
  const { wallet, setWalletAddress } = React.useContext(WalletContext);
  return (
    <div>
      <h1>{wallet && wallet.walletaddress}</h1>
      <h1>THis is menu page</h1>
    </div>
  );
};

export default Menu;

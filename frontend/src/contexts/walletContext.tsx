import { IWallet, TypeWalletContext } from '@types';
import React, { useState, useEffect, useMemo, useCallback, FC } from 'react';

const defaultWalletState = {
  wallet: { walletaddress: null, walletindex: 0, metamaskInstalled: false },
  setWalletAddress: (walletaddress: string) => {}
};

export const WalletContext = React.createContext<TypeWalletContext>(
  defaultWalletState
);

export type WalletProviderProps = {
  children: React.ReactNode; // 👈️ type children
};

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<IWallet>(defaultWalletState.wallet);

  useEffect(() => {
    const getWallet = async () => {
      if (typeof window != 'undefined') {
        //get local storage
        const metamask = localStorage.getItem('GraziaMetamask');
        console.log('metamask', metamask);
        //Have to check the ethereum binding on the window object to see if it's installed
        const { ethereum } = window;
        if (Boolean(ethereum && ethereum.isMetaMask)) {
          console.log('accounts', 'a');
          setWallet({
            ...wallet,
            metamaskInstalled: true
          });
        }

        console.log('net', ethereum.networkVersion);
        if (metamask == 'true' && ethereum?.networkVersion == '137') {
          const accounts: any = await ethereum.request({
            method: 'eth_requestAccounts'
          });

          setWallet({
            ...wallet,
            walletaddress: accounts[0],
            walletindex: 1
          });
        }
      }
    };
    getWallet();
  }, []);

  const setWalletAddress = useCallback(
    (walletaddress: string) => {
      setWallet({
        walletaddress,
        walletindex: 1,
        metamaskInstalled: true
      });
    },
    [setWallet]
  );

  return (
    <WalletContext.Provider value={{ wallet, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

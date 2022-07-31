export interface IWallet {
  walletaddress: string | null;
  metamaskInstalled: boolean;
  walletindex: number;
}

export type TypeWalletContext = {
  wallet: IWallet;
  setWalletAddress: (address: string) => void;
};

interface WalletData {
  walletaddress: string;
  xpub: number;
  mnemonic: string;
  balance: number;
}

interface Props {
  children: JSX.Element[] | JSX.Element;
}

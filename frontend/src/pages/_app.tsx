import "@styles/globals.css";
import { WalletProvider } from "@contexts/walletContext";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
    return (
       
            <WalletProvider>
                <Component {...pageProps} />
            </WalletProvider>
       

    );
}

export default MyApp;

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import {ComposeDB} from "../fragments";
import type { AppProps } from 'next/app'
import { WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import "@/styles/globals.css";

const projectId = ''

const chains = [mainnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId })

createWeb3Modal({ wagmiConfig, projectId, chains })


const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig config={wagmiConfig}>
    <ComposeDB>
      <Component {...pageProps} ceramic />
      </ComposeDB>
    </WagmiConfig>
  );
}

export default MyApp

import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { WalletLinkConnector } from "@web3-react/walletlink-connector"

import MetamaskLogo from "./images/wallet-provider/metamask.png"
import WalletConnectLogo from "./images/wallet-provider/wallet-connect.svg"
import ImTokenLogo from "./images/wallet-provider/imToken.jpeg"

const RPC = {
  42: "https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER",
  80001: "https://rpc-mumbai.matic.today",
  1666600000 : "https://rpc.s0.t.hmny.io"
}

const supportedChainIds = [1666600000]

export const injected = new InjectedConnector({ supportedChainIds })

export const walletconnect = new WalletConnectConnector({
  rpc: RPC,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 15000,
})

export const Connectors = [
  {
    name: "MetaMask",
    connector: injected,
    img: MetamaskLogo,
  },
  {
    name: "imToken",
    connector: walletconnect,
    img: ImTokenLogo,
  },
  {
    name: "WalletConnect",
    connector: walletconnect,
    img: WalletConnectLogo,
  } 
]

import { useState } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"

import { Button } from "./Base"
import WalletsModal from "./modals/WalletConnectModal"

const Wrapper = styled.div`
  position: absolute;
  top: 1.5%;
  left: 0px;
  font-size: 24px;
`

const Container = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
`

const ConnectButton = styled(Button)`
  width: 180px;
  font-size: 16px;
`

const DisconnectButton = styled(ConnectButton)`
  display: inline;
  
`

const Account = () => {
  const { account, deactivate, library } = useWeb3React()

  const [walletLoginVisible, setWalletLoginVisible] = useState(false)

  const toggleWalletConnect = () => setWalletLoginVisible(!walletLoginVisible)

  return (
    <>
      <Wrapper>
        <WalletsModal
          toggleWalletConnect={toggleWalletConnect}
          walletLoginVisible={walletLoginVisible}
        />
        <Container>
          {account ? (
            <DisconnectButton style={{margin : "auto"}} onClick={deactivate}>
              Disconnect 🔌
            </DisconnectButton>
          ) : (
            <ConnectButton style={{margin : "auto"}} onClick={toggleWalletConnect}>
              Connect 🏦
            </ConnectButton>
          )}
        </Container>
      </Wrapper>
    </>
  )
}

export default Account

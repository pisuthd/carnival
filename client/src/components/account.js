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
`

const ConnectButton = styled(Button)`
  width: 180px;
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

          <div style={{ marginRight: "auto", marginLeft: "auto" }}>
            {account ? (
              <DisconnectButton onClick={deactivate}>
                Disconnect 🔌
              </DisconnectButton >
            ) : (
              <ConnectButton onClick={toggleWalletConnect}>
                Connect 🏦
              </ConnectButton>
            )}
          </div>

        </Container>
      </Wrapper>
    </>
  )
}

export default Account

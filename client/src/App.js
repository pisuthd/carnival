import { useState } from "react"
import Account from "./components/account"
import styled, { createGlobalStyle } from "styled-components"
import ParticlesBg from "particles-bg"
import Title from "./components/title"
import Assets from "./components/assets"
import Manage from "./components/manage"
import Footer from "./components/footer"

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'VT323', monospace;
    color: #fff;
    
    /* Full height */
    height: 100vh;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    .particles-bg-canvas-self {
      background: #231F20;
    }
  }
`

const Wrapper = styled.div`
  height: 100vh;
  overflow-y: scroll;
`

function App() {
  const [boxSelected, setBoxSelected] = useState()

  return (
    <>
      <GlobalStyle />
      <ParticlesBg
        type='square'
        bg={true}
      />
      <Wrapper>
        <Account />
        {boxSelected ? (
          <Manage data={boxSelected} setBoxSelected={setBoxSelected} />
        ) : (
          <>
            <Title />
            <Assets setBoxSelected={setBoxSelected} />
             <Footer/>
          </>
        )}
       
      </Wrapper>
    </>
  )
}

export default App

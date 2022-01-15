import { useState } from "react"
import Account from "./components/account"
import styled, { createGlobalStyle } from "styled-components"
import ParticlesBg from "particles-bg"

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'VT323', monospace;
    color: #231F20;
    
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

const Wrapper = styled.div``

function App() {
  return (
    <>
      <GlobalStyle />
      <ParticlesBg type='square' bg={true} />
      <Wrapper>
        <Account />
      </Wrapper>
    </>
  )
}

export default App

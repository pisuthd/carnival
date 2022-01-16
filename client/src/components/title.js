import styled from "styled-components"

const Wrapper = styled.div`
  position: absolute;
  top: 13%;
  left: 0px;
  font-size: 24px;

  h1 {
    letter-spacing: 10px;
    font-size: 80px;
    padding: 0px;
    margin: 0px;
    background: -webkit-linear-gradient(#00467f, #a5cc82);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    padding: 0px;
    margin: 0px;
    margin-top: 10px;
    line-height: 32px;
  }

  @media only screen and (max-width: 600px) {
    font-size: 20px;
    top: 10% p {
      line-height: 24px;
    }

    h1 {
      font-size: 60px;
    }
  }
`

const Title = () => {
  return (
    <Wrapper>
      <div style={{ width: "100vw", textAlign: "center" }}>
        <h1>Carnival</h1>
        <div style={{ maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
          <p>
            An auction-based NFT fractionalize project on Harmony chain
          </p>
        </div>
      </div>
    </Wrapper>
  )
}

export default Title

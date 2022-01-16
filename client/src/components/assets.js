import React, { useCallback, useContext, useState, useRef } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import Slider from "react-slick"
import { LeftArrow, RightArrow, Arrow } from "./Base"

const Wrapper = styled.div`
  height: 100vh;
`

const SliderContainer = styled.div`
  width: 800px;

  @media only screen and (max-width: 1024px) {
    width: 600px;
  }

  @media only screen and (max-width: 600px) {
    width: 300px;
  }
`

const Container = styled.div`
  position: relative;
  width: 60%;
  margin: 0 auto;
  top: 45%;
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    top: 33%;
  }
`

const Container2 = styled.div`
  position: relative;
  width: 60%;
  margin: 0 auto;
  top: 40%;
  font-size: 20px;
  line-height: 22px;

  a {
    color: inherit;
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    top: 35%;
    font-size: 18px;
    line-height: 20px;
  }
`

const BoxContainer = styled.div`
  padding: 16px;
  background-color: white;
  color: black;
  border-radius: 10px;
  border: 3px solid #565049;
  cursor: pointer;
  width: 175px;
  word-wrap: break-word;
  font-size: 24px;
  line-height: 30px;
  overflow: hidden;
  min-height: 100px;
  display: flex;
  text-align: center;

  :hover {
    background-color: #008080;
    color: white;
  }

  margin-left: auto;
  margin-right: auto;
`

const Box = ({ data, setBoxSelected }) => {
  return (
    <BoxContainer onClick={() => setBoxSelected(data)}>
      <div style={{ margin: "auto" }}>{data && data.symbol}</div>
    </BoxContainer>
  )
}

const Assets = ({ setBoxSelected }) => {
  let sliderRef = useRef()
  // const { account, library } = useWeb3React()

  const boxes = [{ symbol: "Crypto Kitties" } ]

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const onPrev = () => {
    sliderRef.slickPrev()
  }

  const onNext = () => {
    sliderRef.slickNext()
  }

  return (
    <Wrapper>
      <Container>
        {
          <>
            <LeftArrow onClick={onPrev} />
            <SliderContainer>
              <Slider ref={(ref) => (sliderRef = ref)} {...settings}>
                {boxes.map((item, index) => {
                  return (
                    <div key={index}>
                      <Box data={item} setBoxSelected={setBoxSelected} />
                    </div>
                  )
                })}
              </Slider>
            </SliderContainer>
            <RightArrow onClick={onNext} />
          </>
        }
      </Container>
    </Wrapper>
  )
}

export default Assets

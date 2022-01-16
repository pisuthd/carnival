import React, { useContext, useCallback, useState, useMemo } from "react"
import styled from "styled-components"
import { ethers } from "ethers"
import { Button } from "./Base"
import { useWeb3React } from "@web3-react/core"
import ReactHtmlParser from "react-html-parser"
import {
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroupText,
  InputGroup,
  Alert,
} from "reactstrap"

const Wrapper = styled.div`
  height: 100vh;
`

const TitleContainer = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
`

const Container = styled.div`
  position: relative;
  width: 60%;
  margin: 0 auto;
  top: 10%;
  display: flex;
  flex-direction: column;
  font-size: 16px;
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;

  .detail {
    display: flex;
    flex-direction: column;

    .top {
      font-size: 20px;
    }

    .bottom {
      font-size: 24px;
      font-weight: bold;
    }
  }
`

const AuctionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  .header {
    font-size: 24px;
    text-decoration: underline;
  }
`

const AuctionList = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const BoxContainer = styled.div`
  padding: 16px;
  background-color: #fff;
  border-radius: 10px;
  border: 3px solid #000;
  cursor: pointer;
  margin: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  height: 160px;
  color: #000;

  ${(props) => props.active && "background-color: #008080;"}
`

const ActionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
`

const TableContainer = styled.div`
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  border: 3px solid #565049;
  padding: 12px;
  background-color: white;
  color: black;
  margin-top: 12px;
  width: 100%;
  font-size: 20px;
  line-height: 22px;
  max-width: 700px;
  height: 200px;
  overflow-y: scroll;
`

const BuyContainer = styled.div`
  border-radius: 10px;
  border: 3px solid #565049;
  padding: 12px;
  background-color: white;
  margin-top: 12px;
  margin-left: 12px;
`

const InputGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 12px;
  color: #000;
  font-weight: bold;
`

const InputHeader = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
`

const ReclaimContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
	margin-bottom: 40px;

  .header {
    font-size: 24px;
    text-decoration: underline;
  }
`

const ReclaimListContainer = styled.div`
  display: flex;
`

const ReclaimList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 70%;
`

const ClaimContainer = styled.div`
  border-radius: 10px;
  border: 3px solid #565049;
  padding: 12px;
  background-color: white;
	height: 300px;
  margin-top: 12px;
  margin-left: 12px;
	width: 30%;
`

const Box = () => {
  return <BoxContainer>gang</BoxContainer>
}

const Manage = ({ data, setBoxSelected }) => {
  const { account, library } = useWeb3React()

  return (
    <Wrapper>
      <Container>
        <TitleContainer>
          <div style={{ flex: 1 }} onClick={() => setBoxSelected(null)}>
            {"<<"} Back
          </div>
          <div style={{ cursor: "default" }}> {data.symbol}</div>
        </TitleContainer>
        <HeaderContainer>
          <div className='detail'>
            <div className='top'>Expire In</div>
            <div className='bottom'>4 Hrs</div>
          </div>
          <div className='detail'>
            <div className='top'>Stage</div>
            <div className='bottom'>Auction</div>
          </div>
          <div className='detail'>
            <div className='top'>Vault Price</div>
            <div className='bottom'>100 USDC</div>
          </div>
        </HeaderContainer>
        <AuctionContainer>
          <div className='header'>Auction</div>
          <AuctionList>
            {[0, 0, 0, 0, 0, 0, 0].map((data, index) => (
              <Box key={index} />
            ))}
          </AuctionList>
        </AuctionContainer>
        <HeaderContainer>
          <div className='detail'>
            <div className='top'>To be issued</div>
            <div className='bottom'>7 Punk</div>
          </div>
          <div className='detail'>
            <div className='top'>Total deposited</div>
            <div className='bottom'>400 USDC</div>
          </div>
          <div className='detail'>
            <div className='top'>Participants</div>
            <div className='bottom'>3</div>
          </div>
          <div className='detail'>
            <div className='top'>Avg. Price</div>
            <div className='bottom'>1.5 USDC</div>
          </div>
        </HeaderContainer>
        <ActionContainer>
          <TableContainer style={{ width: "70%" }}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th scope='col' width='5%'>
                    #
                  </th>
                  <th scope='col'>Address</th>
                  <th scope='col'>Amount</th>
                  <th scope='col'>Price</th>
                  <th scope='col'>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope='row'>1</th>
                  <td>0xGang33...gggg</td>
                  <td>1</td>
                  <td>3</td>
                  <td>5</td>
                </tr>
                <tr>
                  <th scope='row'>2</th>
                  <td>0xGang33...gggg</td>
                  <td>1</td>
                  <td>3</td>
                  <td>5</td>
                </tr>
                <tr>
                  <th scope='row'>3</th>
                  <td>0xGang33...gggg</td>
                  <td>1</td>
                  <td>3</td>
                  <td>5</td>
                </tr>
              </tbody>
            </table>
          </TableContainer>
          <BuyContainer style={{ width: "30%" }}>
            <InputGroupContainer>
              <InputHeader>Amount</InputHeader>
              <Input type='number' placeholder='Amount' />
            </InputGroupContainer>
            <InputGroupContainer>
              <InputHeader>Price</InputHeader>
              <Input type='number' placeholder='Price' />
            </InputGroupContainer>
            <Button color='primary'>Place</Button>
          </BuyContainer>
        </ActionContainer>
        <ReclaimContainer>
          <div className='header'>Reclaimation</div>
          <ReclaimListContainer>
            <ReclaimList>
              {[0, 0, 0, 0, 0, 0, 0].map((data, index) => (
                <Box key={index} />
              ))}
            </ReclaimList>
						<ClaimContainer>
						<Button color='primary'>Claim</Button>
						</ClaimContainer>
          </ReclaimListContainer>
        </ReclaimContainer>
      </Container>
    </Wrapper>
  )
}

export default Manage

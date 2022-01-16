import React, { useContext, useCallback, useState, useMemo } from "react"
import styled from "styled-components"
import { ethers } from "ethers"
import { Button } from "./Base"
import { useWeb3React } from "@web3-react/core"
import ReactHtmlParser from "react-html-parser"
import { toast } from "react-toastify"
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
import { VaultContext } from "../hooks/useVault"

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

const Box = ({ data }) => {
  return <BoxContainer>
    <img src={data} />
  </BoxContainer>
}

const Manage = ({ data, setBoxSelected }) => {
  const { account, library } = useWeb3React()

  const { refPrice, contractState, auctionEnded, totalToken, totalSettlementToken, bid, bidders } = useContext(VaultContext)

  const [amount, setAmount] = useState()
  const [price, setPrice] = useState()

  const onPlace = useCallback(async () => {

    try {

      if (amount === 0 && price === 0) {
        throw new Error("Input Error")
      }

      const tx = await bid(amount, price)

      toast.info("Bidding", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

      await tx.wait()

      toast.info("Done", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

    } catch (e) {

      console.log(e)

      const msg =
        e.data &&
        e.data.message &&
        e.data.message.substring(e.data.message.lastIndexOf(":") + 1)

      toast.warn(`${msg || "Unknown Error"}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }

  }, [amount, price])

  // sorry we're hard-coded preview images here
  const previews = useMemo(() => {
    let result = []

    if (totalToken && totalToken > 0) {

      for (let i = 0; i < totalToken; i++) {
        let url
        switch (i) {
          case 1:
            url = "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1002.svg"
            break;
          case 2:
            url = "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1003.svg"
            break;
          case 3:
            url = "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1004.svg"
            break;
          case 4:
            url = "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1005.svg"
            break;
          case 5:
            url = "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1006.svg"
            break;
          case 6:
            url = "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1007.svg"
            break;
          case 7:
            url = "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1008.svg"
            break;
          default:
            url = "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1001.svg"
        }
        result.push(url)
      }

    }

    return result
  }, [totalToken])

  const shortAddress = (address, first = 6, last = -4) => {
    return `${address.slice(0, first)}...${address.slice(last)}`
  }

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
            <div className='top'>Stage</div>
            <div className='bottom'>
              {contractState === 0 && "Pre-Auction"}
              {contractState === 1 && "Auction"}
              {contractState === 2 && "Post-Auction"}

            </div>
          </div>
          <div className='detail'>
            <div className='top'>Expires At</div>
            <div className='bottom'>
              {auctionEnded.toLocaleTimeString()}
            </div>
          </div>

          <div className='detail'>
            <div className='top'>Floor Price</div>
            <div className='bottom'>{refPrice} ONE</div>
          </div>
        </HeaderContainer>

        <AuctionContainer>
          <div className='header'>Current Collection</div>
          <AuctionList>
            {previews.map((data, index) => (
              <Box key={index} data={data} />
            ))}
          </AuctionList>
        </AuctionContainer>

        <HeaderContainer>
          <div className='detail'>
            <div className='top'>To be issued</div>
            <div className='bottom'>{totalToken} Kitties</div>
          </div>
          <div className='detail'>
            <div className='top'>Total deposited</div>
            <div className='bottom'>{totalSettlementToken} ONE</div>
          </div>
          {/* <div className='detail'>
            <div className='top'>Participants</div>
            <div className='bottom'>3</div>
          </div>
          <div className='detail'>
            <div className='top'>Avg. Price</div>
            <div className='bottom'>1.5 USDC</div>
          </div> */}
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

                {bidders.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th scope='row'>1</th>
                      <td>{shortAddress(item.address)}</td>
                      <td>
                        { (Number(item.amount)).toLocaleString()}
                      </td>
                      <td>
                      { (Number(item.totalValue) / Number(item.amount)).toLocaleString()}
                      </td>
                      <td>
                      { (Number(item.totalValue)).toLocaleString()}
                      </td>
                    </tr>
                  )
                })}

                {/* <tr>
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
                </tr> */}
              </tbody>
            </table>
          </TableContainer>
          <BuyContainer style={{ width: "30%" }}>
            <InputGroupContainer>
              <InputHeader>Amount</InputHeader>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} type='number' placeholder='Amount' />
            </InputGroupContainer>
            <InputGroupContainer>
              <InputHeader>Price</InputHeader>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} type='number' placeholder='Price' />
            </InputGroupContainer>
            <Button onClick={onPlace} color='primary'>Place</Button>
          </BuyContainer>
        </ActionContainer>
        {/* <ReclaimContainer>
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
        </ReclaimContainer> */}
      </Container>
    </Wrapper>
  )
}

export default Manage

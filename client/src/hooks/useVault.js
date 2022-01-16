import React, {
    useMemo,
    createContext,
    useState,
    useEffect,
    useCallback,
    useReducer
} from "react"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"
import VaultABI from "../abi/Vault.json"
import { VAULT_ADDRESS } from "../constants"

export const VaultContext = createContext({})

const Provider = ({ children }) => {

    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case "UPDATE_VAULT_DATA":

                    const { vaultTokenAddress, contractState, refPrice, auctionEnded, totalToken, totalSettlementToken } = action.data

                    return {
                        ...prevState,
                        vaultTokenAddress,
                        contractState,
                        refPrice,
                        auctionEnded,
                        totalToken,
                        totalSettlementToken
                    }
                case "UPDATE_BIDDERS":
                    return {
                        ...prevState,
                        bidders: action.data
                    }
                default:
                    return {
                        ...prevState,
                    }
            }
        },
        {
            vaultTokenAddress: null,
            contractState: 0,
            refPrice: 0,
            auctionEnded: new Date(),
            totalToken: 0,
            totalSettlementToken: 0,
            bidders: []
        }
    )

    const { contractState, vaultTokenAddress, refPrice, auctionEnded, totalToken, totalSettlementToken, bidders } = state

    const { account, library } = useWeb3React()

    const [tick, setTick] = useState(0)

    const increaseTick = useCallback(() => {
        setTick(tick + 1)
    }, [tick])

    const vaultContract = useMemo(() => {
        if (!account || !library) {
            return
        }
        return new ethers.Contract(VAULT_ADDRESS, VaultABI, library.getSigner())
    }, [account, library])

    const bid = useCallback(async (amount, price) => {
        const value = Number(amount) * Number(price)
        return vaultContract.bid(ethers.utils.parseEther(`${amount}`), ethers.utils.parseEther(`${value}`), {
            value: ethers.utils.parseEther(`${value}`),
        })
    }, [vaultContract])

    const loadVaultData = useCallback(async () => {

        try {

            const state = await vaultContract.state()
            const refPrice = await vaultContract.referencePrice()
            const vaultTokenAddress = await vaultContract.vaultToken()
            const auctionEnded = await vaultContract.auctionEnded()
            const totalToken = await vaultContract.totalToken()
            const totalSettlementToken = await vaultContract.totalSettlementToken()

            dispatch({
                type: "UPDATE_VAULT_DATA", data: {
                    vaultTokenAddress,
                    contractState: state,
                    refPrice: ethers.utils.formatEther(refPrice),
                    auctionEnded: new Date(auctionEnded * 1000),
                    totalToken: ethers.utils.formatEther(totalToken),
                    totalSettlementToken: ethers.utils.formatEther(totalSettlementToken)
                }
            })

        } catch (e) {

            console.log(e)

        }

    }, [vaultContract])

    const loadBidder = useCallback(async () => {

        try {
            let bidders = []
            for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
                try {
                    const data = await vaultContract.bidding(i)

                    bidders.push({
                        address: data.bidder,
                        amount: ethers.utils.formatEther(data.amount),
                        totalValue: ethers.utils.formatEther(data.totalValue),
                    })
                } catch (e) {
                    break
                }
            }
            dispatch({
                type: "UPDATE_BIDDERS", data: bidders
            })

        } catch (e) {

            console.log(e)

        }

    }, [vaultContract])

    useEffect(() => {
        vaultContract && loadVaultData()
        vaultContract && loadBidder()
    }, [account, vaultContract, tick])

    const vaultContext = useMemo(
        () => ({
            tick,
            increaseTick,
            contractState,
            vaultTokenAddress,
            refPrice,
            auctionEnded,
            totalToken,
            totalSettlementToken,
            bid,
            bidders
            //   currentNetwork,
            //   updateNetwork: (network) => {
            //     dispatch({ type: "UPDATE_NETWORK", data: network })
            //   }
        }),
        [
            increaseTick,
            tick,
            contractState,
            vaultTokenAddress,
            refPrice,
            auctionEnded,
            totalToken,
            totalSettlementToken,
            bid,
            bidders
        ]
    )

    return (
        <VaultContext.Provider value={vaultContext}>
            {children}
        </VaultContext.Provider>
    )
}

export default Provider
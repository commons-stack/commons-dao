import React, { useContext, useEffect, useState } from 'react'
import { useConnect } from '@1hive/connect-react'
import BN from 'bn.js'
import { useOrganizationState } from '../../providers/OrganizationProvider'
import { useMounted } from '../../hooks/shared/useMounted'
import { useWallet } from '../../providers/Wallet'
import { useTokenBalanceOf } from '../../hooks/shared/useAccountTokenBalance'

const TokenWrapperContext = React.createContext()

const reduceHolders = (holders = []) => {
  if (!holders) {
    return []
  }
  const reducedHolders = holders
    .map(holder => {
      return {
        address: holder.address,
        balance: new BN(holder.balance),
      }
    })
    .sort((a, b) => b.balance.cmp(a.balance))

  return reducedHolders
}
const reduceToken = token => {
  if (!token) {
    return null
  }
  const { decimals, totalSupply } = token
  return {
    ...token,
    decimals: new BN(decimals),
    numDecimals: parseInt(decimals, 10),
    tokenDecimalsBase: new BN(10).pow(new BN(decimals)),
    totalSupply: totalSupply && new BN(totalSupply),
  }
}

function TokenWrapperProvider({ children }) {
  const chainId = 100 // TODO- handle chains
  const { account } = useWallet()
  const [holders, setHolders] = useState([])
  const [wrappedToken, setWrappedToken] = useState()
  const [depositedToken, setDepositedToken] = useState()
  const mounted = useMounted()
  const { connectedTokenWrapperApp } = useOrganizationState()

  const [connectHolders, connectHoldersStatus] = useConnect(() => {
    return connectedTokenWrapperApp?.onTokenHolders()
  }, [connectedTokenWrapperApp])

  const [connectWrappedToken, connectWrappedTokensStatus] = useConnect(() => {
    return connectedTokenWrapperApp?.wrappedToken()
  }, [connectedTokenWrapperApp])

  const [
    connectDepositedToken,
    connectDepositedTokensStatus,
  ] = useConnect(() => {
    return connectedTokenWrapperApp?.token()
  }, [connectedTokenWrapperApp])

  const wrappedTokenBalance = useTokenBalanceOf(
    wrappedToken?.id,
    account,
    chainId
  )
  const depositedTokenBalance = useTokenBalanceOf(
    depositedToken?.id,
    account,
    chainId
  )

  useEffect(() => {
    const reducedVotes = reduceHolders(connectHolders)
    if (mounted()) {
      setHolders(reducedVotes)
    }
  }, [connectHolders, mounted])

  useEffect(() => {
    const reducedToken = reduceToken(connectWrappedToken)
    if (mounted()) {
      setWrappedToken(reducedToken)
    }
  }, [connectWrappedToken, mounted])

  useEffect(() => {
    const reducedToken = reduceToken(connectDepositedToken)
    if (mounted()) {
      setDepositedToken(reducedToken)
    }
  }, [connectDepositedToken, mounted])

  const error =
    !connectHoldersStatus?.error &&
    !connectWrappedTokensStatus?.error &&
    !connectDepositedTokensStatus.error

  const loading =
    !connectHoldersStatus?.loading &&
    !connectWrappedTokensStatus.loading &&
    !connectDepositedTokensStatus.loading &&
    account &&
    !wrappedTokenBalance.eq(new BN(-1)) &&
    account &&
    !depositedTokenBalance.eq(new BN(-1))

  return (
    <TokenWrapperContext.Provider
      value={{
        isSyncing: !loading && !error,
        holders,
        wrappedToken: { ...wrappedToken, accountBalance: wrappedTokenBalance },
        depositedToken: {
          ...depositedToken,
          accountBalance: depositedTokenBalance,
        },
        connectedTokenWrapperApp,
      }}
    >
      {children}
    </TokenWrapperContext.Provider>
  )
}

function useAppState() {
  return useContext(TokenWrapperContext)
}

export { TokenWrapperProvider, useAppState }
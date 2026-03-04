'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { ethers } from 'ethers'
import { ARC_TESTNET, CONTRACTS, ERC20_ABI } from '@/lib/arc'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { ethereum?: any } }

interface Balances { USDC: string; EURC: string; native: string }

interface WalletState {
  address: string | null; shortAddress: string; isConnected: boolean
  isConnecting: boolean; balances: Balances
  provider: ethers.BrowserProvider | null; signer: ethers.JsonRpcSigner | null
  error: string | null
  connect: () => Promise<void>; disconnect: () => void; refreshBalances: () => Promise<void>
}

const WalletCtx = createContext<WalletState | null>(null)

export function useWallet() {
  const ctx = useContext(WalletCtx)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [balances, setBalances] = useState<Balances>({ USDC: '0', EURC: '0', native: '0' })
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shortAddress = address ? address.slice(0, 6) + '...' + address.slice(-4) : ''

  const refreshBalances = useCallback(async (addr?: string) => {
    const target = addr || address
    if (!target) return
    try {
      const rpc = new ethers.JsonRpcProvider(ARC_TESTNET.rpc)
      const native = await rpc.getBalance(target)
      const usdc = new ethers.Contract(CONTRACTS.USDC, ERC20_ABI, rpc)
      const eurc = new ethers.Contract(CONTRACTS.EURC, ERC20_ABI, rpc)
      const [usdcBal, eurcBal] = await Promise.all([usdc.balanceOf(target), eurc.balanceOf(target)])
      setBalances({
        native: parseFloat(ethers.formatUnits(native, 18)).toFixed(4),
        USDC: parseFloat(ethers.formatUnits(usdcBal, 6)).toFixed(4),
        EURC: parseFloat(ethers.formatUnits(eurcBal, 6)).toFixed(4),
      })
    } catch (e) { console.error('Balance error:', e) }
  }, [address])

  async function ensureArcNetwork() {
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: ARC_TESTNET.chainIdHex }] })
    } catch (switchErr: unknown) {
      const switchCode = (switchErr as { code?: number }).code
      // 4902 = chain not added yet → try to add it
      if (switchCode === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: ARC_TESTNET.chainIdHex, chainName: ARC_TESTNET.name, nativeCurrency: ARC_TESTNET.nativeCurrency, rpcUrls: [ARC_TESTNET.rpc], blockExplorerUrls: [ARC_TESTNET.explorer] }],
          })
        } catch (addErr: unknown) {
          const addCode = (addErr as { code?: number }).code
          // 4001 = user rejected → rethrow
          // Everything else (e.g. "same RPC endpoint already exists") → ignore, network is already there
          if (addCode === 4001) throw addErr
          // Network already present under a different name/config — that's fine, proceed
        }
      } else if (switchCode === 4001) {
        // User explicitly rejected the switch → rethrow so connect() shows an error
        throw switchErr
      }
      // Any other switch error (e.g. internal MetaMask error) → ignore and proceed
    }
  }

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) { setError('No wallet found. Install MetaMask.'); return }
    setIsConnecting(true); setError(null)
    try {
      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (!accounts[0]) throw new Error('No account')
      await ensureArcNetwork()
      const _provider = new ethers.BrowserProvider(window.ethereum)
      const _signer = await _provider.getSigner()
      setProvider(_provider); setSigner(_signer); setAddress(accounts[0])
      await refreshBalances(accounts[0])
    } catch (e: unknown) {
      const err = e as { code?: number; message?: string }
      setError(err.code === 4001 ? 'Rejected.' : err.message || 'Failed')
    } finally { setIsConnecting(false) }
  }, [refreshBalances])

  const disconnect = useCallback(() => {
    setAddress(null); setProvider(null); setSigner(null)
    setBalances({ USDC: '0', EURC: '0', native: '0' })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return
    const onAccounts = async (accs: string[]) => {
      if (!accs[0]) { disconnect(); return }
      setAddress(accs[0])
      const p = new ethers.BrowserProvider(window.ethereum)
      setProvider(p); setSigner(await p.getSigner())
      await refreshBalances(accs[0])
    }
    window.ethereum.on('accountsChanged', onAccounts)
    window.ethereum.on('chainChanged', () => window.location.reload())
    return () => { window.ethereum?.removeListener('accountsChanged', onAccounts) }
  }, [disconnect, refreshBalances])

  useEffect(() => {
    if (!address) return
    const id = setInterval(() => refreshBalances(), 10_000)
    return () => clearInterval(id)
  }, [address, refreshBalances])

  return (
    <WalletCtx.Provider value={{ address, shortAddress, isConnected: !!address, isConnecting, balances, provider, signer, error, connect, disconnect, refreshBalances }}>
      {children}
    </WalletCtx.Provider>
  )
}

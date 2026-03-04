'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { ethers } from 'ethers'
import { ARC_TESTNET, CONTRACTS, ERC20_ABI } from '@/lib/arc'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Balances {
  USDC: string   // formatted, 6 decimals via ERC-20 interface
  EURC: string   // formatted, 6 decimals
  native: string // formatted, 18 decimals (native USDC balance)
}

interface WalletState {
  address: string | null
  shortAddress: string
  isConnected: boolean
  isConnecting: boolean
  balances: Balances
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
  refreshBalances: () => Promise<void>
}

// ─── Context ──────────────────────────────────────────────────────────────────
const WalletCtx = createContext<WalletState | null>(null)

export function useWallet() {
  const ctx = useContext(WalletCtx)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [balances, setBalances] = useState<Balances>({ USDC: '0', EURC: '0', native: '0' })
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shortAddress = address ? address.slice(0, 6) + '...' + address.slice(-4) : ''

  // Fetch all balances for a given address using a read-only provider
  const refreshBalances = useCallback(async (addr?: string) => {
    const target = addr || address
    if (!target) return
    try {
      const rpc = new ethers.JsonRpcProvider(ARC_TESTNET.rpc)

      // Native USDC balance (18 decimals)
      const native = await rpc.getBalance(target)
      const nativeFmt = parseFloat(ethers.formatUnits(native, 18)).toFixed(4)

      // USDC via ERC-20 (6 decimals) — the recommended interface
      const usdc = new ethers.Contract(CONTRACTS.USDC, ERC20_ABI, rpc)
      const usdcBal = await usdc.balanceOf(target)
      const usdcFmt = parseFloat(ethers.formatUnits(usdcBal, 6)).toFixed(4)

      // EURC (6 decimals)
      const eurc = new ethers.Contract(CONTRACTS.EURC, ERC20_ABI, rpc)
      const eurcBal = await eurc.balanceOf(target)
      const eurcFmt = parseFloat(ethers.formatUnits(eurcBal, 6)).toFixed(4)

      setBalances({ USDC: usdcFmt, EURC: eurcFmt, native: nativeFmt })
    } catch (e) {
      console.error('Balance fetch error:', e)
    }
  }, [address])

  // Add Arc Testnet to MetaMask if not present
  async function ensureArcNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_TESTNET.chainIdHex }],
      })
    } catch (switchErr: any) {
      if (switchErr.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: ARC_TESTNET.chainIdHex,
            chainName: ARC_TESTNET.name,
            nativeCurrency: ARC_TESTNET.nativeCurrency,
            rpcUrls: [ARC_TESTNET.rpc],
            blockExplorerUrls: [ARC_TESTNET.explorer],
          }],
        })
      } else throw switchErr
    }
  }

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('No wallet found. Install MetaMask or Coinbase Wallet.')
      return
    }
    setIsConnecting(true)
    setError(null)
    try {
      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (!accounts[0]) throw new Error('No account returned')

      await ensureArcNetwork()

      const _provider = new ethers.BrowserProvider(window.ethereum)
      const _signer = await _provider.getSigner()
      const _address = accounts[0]

      setProvider(_provider)
      setSigner(_signer)
      setAddress(_address)
      await refreshBalances(_address)
    } catch (e: any) {
      if (e.code === 4001) setError('Connection rejected.')
      else setError(e.message || 'Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }, [refreshBalances])

  const disconnect = useCallback(() => {
    setAddress(null); setProvider(null); setSigner(null)
    setBalances({ USDC: '0', EURC: '0', native: '0' })
  }, [])

  // Listen for wallet events
  useEffect(() => {
    if (!window.ethereum) return
    const onAccountsChanged = async (accs: string[]) => {
      if (!accs[0]) { disconnect(); return }
      setAddress(accs[0])
      const _provider = new ethers.BrowserProvider(window.ethereum)
      const _signer = await _provider.getSigner()
      setProvider(_provider); setSigner(_signer)
      await refreshBalances(accs[0])
    }
    const onChainChanged = () => window.location.reload()
    window.ethereum.on('accountsChanged', onAccountsChanged)
    window.ethereum.on('chainChanged', onChainChanged)
    return () => {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged)
      window.ethereum.removeListener('chainChanged', onChainChanged)
    }
  }, [disconnect, refreshBalances])

  // Auto-refresh balances every 10s when connected
  useEffect(() => {
    if (!address) return
    const id = setInterval(() => refreshBalances(), 10_000)
    return () => clearInterval(id)
  }, [address, refreshBalances])

  return (
    <WalletCtx.Provider value={{
      address, shortAddress, isConnected: !!address,
      isConnecting, balances, provider, signer, error,
      connect, disconnect, refreshBalances,
    }}>
      {children}
    </WalletCtx.Provider>
  )
}

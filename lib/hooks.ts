'use client'

import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { ARC_TESTNET, CONTRACTS, ERC20_ABI } from '@/lib/arc'

const rpc = new ethers.JsonRpcProvider(ARC_TESTNET.rpc)

// ─── useNetworkStats — live block number + RPC status ────────────────────────
export function useNetworkStats() {
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [status, setStatus] = useState<'connecting' | 'online' | 'error'>('connecting')
  const [gasPrice, setGasPrice] = useState<string>('0.001')

  const fetchBlock = useCallback(async () => {
    try {
      const block = await rpc.getBlockNumber()
      setBlockNumber(block)
      setStatus('online')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchBlock()
    const id = setInterval(fetchBlock, 4000)
    return () => clearInterval(id)
  }, [fetchBlock])

  return { blockNumber, status, gasPrice }
}

// ─── useTxHistory — scan recent blocks for user's txs ────────────────────────
export interface TxRecord {
  hash: string
  from: string
  to: string | null
  value: string       // formatted USDC
  blockNumber: number
  timestamp?: number
  type: 'sent' | 'received' | 'contract'
  status: 'confirmed'
}

export function useTxHistory(address: string | null) {
  const [txs, setTxs] = useState<TxRecord[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!address) { setTxs([]); return }
    setLoading(true)
    try {
      const latest = await rpc.getBlockNumber()
      // Scan last 200 blocks (fast on Arc with ~0.8s blocks)
      const fromBlock = Math.max(0, latest - 200)
      const found: TxRecord[] = []

      // Also query ERC-20 Transfer events for USDC
      const usdcContract = new ethers.Contract(CONTRACTS.USDC, ERC20_ABI, rpc)
      const sentFilter = usdcContract.filters.Transfer(address, null)
      const recvFilter = usdcContract.filters.Transfer(null, address)

      const [sentLogs, recvLogs] = await Promise.all([
        usdcContract.queryFilter(sentFilter, fromBlock, latest).catch(() => []),
        usdcContract.queryFilter(recvFilter, fromBlock, latest).catch(() => []),
      ])

      const allLogs = [...sentLogs, ...recvLogs]
      const seenHashes = new Set<string>()

      for (const log of allLogs) {
        if (seenHashes.has(log.transactionHash)) continue
        seenHashes.add(log.transactionHash)
        const parsed = usdcContract.interface.parseLog({ topics: [...log.topics], data: log.data })
        if (!parsed) continue
        found.push({
          hash: log.transactionHash,
          from: parsed.args[0],
          to: parsed.args[1],
          value: parseFloat(ethers.formatUnits(parsed.args[2], 6)).toFixed(4),
          blockNumber: log.blockNumber,
          type: parsed.args[0].toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
          status: 'confirmed',
        })
      }

      // Sort newest first
      found.sort((a, b) => b.blockNumber - a.blockNumber)
      setTxs(found.slice(0, 20))
    } catch (e) {
      console.error('tx history error:', e)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { refresh() }, [refresh])

  // Auto-refresh every 15s
  useEffect(() => {
    if (!address) return
    const id = setInterval(refresh, 15_000)
    return () => clearInterval(id)
  }, [address, refresh])

  return { txs, loading, refresh }
}

// ─── useLiveFeed — mock live tx feed with real block context ─────────────────
interface FeedTx {
  id: string
  from: string
  to: string
  amount: string
  flagFrom: string
  flagTo: string
  age: string
  blockNumber: number
}

const CORRIDORS = [
  { from: 'Singapore', to: 'Dubai', ff: '🇸🇬', ft: '🇦🇪', min: 10000, max: 500000 },
  { from: 'New York', to: 'London', ff: '🇺🇸', ft: '🇬🇧', min: 20000, max: 400000 },
  { from: 'Tokyo', to: 'Seoul', ff: '🇯🇵', ft: '🇰🇷', min: 1000, max: 50000 },
  { from: 'Frankfurt', to: 'Mumbai', ff: '🇩🇪', ft: '🇮🇳', min: 5000, max: 200000 },
  { from: 'São Paulo', to: 'Miami', ff: '🇧🇷', ft: '🇺🇸', min: 3000, max: 80000 },
  { from: 'Sydney', to: 'Hong Kong', ff: '🇦🇺', ft: '🇭🇰', min: 50000, max: 800000 },
  { from: 'Zürich', to: 'Singapore', ff: '🇨🇭', ft: '🇸🇬', min: 100000, max: 1000000 },
  { from: 'Seoul', to: 'Frankfurt', ff: '🇰🇷', ft: '🇩🇪', min: 8000, max: 150000 },
]

function randAmount(min: number, max: number) {
  return (Math.floor(Math.random() * (max - min) / 100) * 100 + min).toLocaleString()
}

let txCounter = 8821

export function useLiveFeed() {
  const [feed, setFeed] = useState<FeedTx[]>([])
  const [blockNumber, setBlockNumber] = useState<number>(0)

  useEffect(() => {
    // Seed initial feed
    const initial = CORRIDORS.slice(0, 5).map((c, i) => ({
      id: `TX-${txCounter - i}`,
      from: c.from, to: c.to,
      amount: randAmount(c.min, c.max),
      flagFrom: c.ff, flagTo: c.ft,
      age: i === 0 ? '2s ago' : `${i * 8 + 2}s ago`,
      blockNumber: 0,
    }))
    setFeed(initial)
  }, [])

  // Add new tx every 4.5s
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const block = await rpc.getBlockNumber()
        setBlockNumber(block)
        const c = CORRIDORS[Math.floor(Math.random() * CORRIDORS.length)]
        const newTx: FeedTx = {
          id: `TX-${++txCounter}`,
          from: c.from, to: c.to,
          amount: randAmount(c.min, c.max),
          flagFrom: c.ff, flagTo: c.ft,
          age: 'just now',
          blockNumber: block,
        }
        setFeed(prev => [newTx, ...prev].slice(0, 6))
      } catch {}
    }, 4500)
    return () => clearInterval(id)
  }, [])

  return { feed, blockNumber }
}

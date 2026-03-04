'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ethers } from 'ethers'
import { ARC_TESTNET, CONTRACTS, ERC20_ABI } from '@/lib/arc'

const rpc = new ethers.JsonRpcProvider(ARC_TESTNET.rpc)

// ─── useNetworkStats — live block number + RPC status ────────────────────────
export function useNetworkStats() {
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [status, setStatus] = useState<'connecting' | 'online' | 'error'>('connecting')
  const [gasPrice] = useState<string>('0.001')

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
  value: string
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
      const fromBlock = Math.max(0, latest - 300)
      const usdcContract = new ethers.Contract(CONTRACTS.USDC, ERC20_ABI, rpc)
      const sentFilter = usdcContract.filters.Transfer(address, null)
      const recvFilter = usdcContract.filters.Transfer(null, address)

      const [sentLogs, recvLogs] = await Promise.all([
        usdcContract.queryFilter(sentFilter, fromBlock, latest).catch(() => []),
        usdcContract.queryFilter(recvFilter, fromBlock, latest).catch(() => []),
      ])

      const allLogs = [...sentLogs, ...recvLogs]
      const seenHashes = new Set<string>()
      const found: TxRecord[] = []

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

      found.sort((a, b) => b.blockNumber - a.blockNumber)
      setTxs(found.slice(0, 20))
    } catch (e) {
      console.error('tx history error:', e)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { refresh() }, [refresh])

  // Poll every 5s (reliable with HTTP RPC — avoids ethers event polling silently stopping)
  useEffect(() => {
    if (!address) return
    const id = setInterval(refresh, 5_000)
    return () => clearInterval(id)
  }, [address, refresh])

  return { txs, loading, refresh }
}

// ─── useNetworkVolume — real USDC volume from recent blocks ──────────────────
export interface NetworkVolume {
  totalVolume: string   // formatted USDC, e.g. "12345.67"
  txCount: number
  blockWindow: number
  loading: boolean
}

export function useNetworkVolume() {
  const [data, setData] = useState<NetworkVolume>({ totalVolume: '0', txCount: 0, blockWindow: 0, loading: true })

  const fetch = useCallback(async () => {
    try {
      const latest = await rpc.getBlockNumber()
      const WINDOW = 200
      const fromBlock = Math.max(0, latest - WINDOW)

      const usdcContract = new ethers.Contract(CONTRACTS.USDC, ERC20_ABI, rpc)
      const allFilter = usdcContract.filters.Transfer()
      const logs = await usdcContract.queryFilter(allFilter, fromBlock, latest).catch(() => [])

      let total = BigInt(0)
      const seenHashes = new Set<string>()

      for (const log of logs) {
        if (seenHashes.has(log.transactionHash)) continue
        seenHashes.add(log.transactionHash)
        const parsed = usdcContract.interface.parseLog({ topics: [...log.topics], data: log.data })
        if (!parsed) continue
        total += BigInt(parsed.args[2].toString())
      }

      const volumeFormatted = parseFloat(ethers.formatUnits(total, 6)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })

      setData({
        totalVolume: volumeFormatted,
        txCount: seenHashes.size,
        blockWindow: WINDOW,
        loading: false,
      })
    } catch (e) {
      console.error('volume fetch error:', e)
      setData(prev => ({ ...prev, loading: false }))
    }
  }, [])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, 30_000)
    return () => clearInterval(id)
  }, [fetch])

  return data
}

// ─── useLiveFeed — real Transfer events from Arc Testnet per block ─────────────
export interface FeedTx {
  hash: string
  from: string
  to: string
  amount: string      // formatted USDC
  blockNumber: number
  ageSeconds: number  // seconds since block was seen
  token: string
}

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function useLiveFeed() {
  const [feed, setFeed] = useState<FeedTx[]>([])
  const [blockNumber, setBlockNumber] = useState<number>(0)
  const seenHashes = useRef(new Set<string>())
  const blockTimes = useRef<Map<number, number>>(new Map())

  const fetchBlockEvents = useCallback(async (blockNum: number) => {
    try {
      blockTimes.current.set(blockNum, Date.now())
      // Trim old entries
      if (blockTimes.current.size > 100) {
        const oldest = Math.min(...Array.from(blockTimes.current.keys()))
        blockTimes.current.delete(oldest)
      }

      const usdcContract = new ethers.Contract(CONTRACTS.USDC, ERC20_ABI, rpc)
      const allFilter = usdcContract.filters.Transfer()
      const logs = await usdcContract.queryFilter(allFilter, blockNum, blockNum).catch(() => [])

      const newTxs: FeedTx[] = []
      for (const log of logs) {
        if (seenHashes.current.has(log.transactionHash)) continue
        seenHashes.current.add(log.transactionHash)
        const parsed = usdcContract.interface.parseLog({ topics: [...log.topics], data: log.data })
        if (!parsed) continue
        const amount = parseFloat(ethers.formatUnits(parsed.args[2], 6))
        if (amount <= 0) continue
        newTxs.push({
          hash: log.transactionHash,
          from: shortAddr(parsed.args[0]),
          to: shortAddr(parsed.args[1]),
          amount: amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          blockNumber: blockNum,
          ageSeconds: 0,
          token: 'USDC',
        })
      }

      if (newTxs.length > 0) {
        setFeed(prev => [...newTxs, ...prev].slice(0, 8))
      }
    } catch (e) {
      console.error('livefeed block error:', e)
    }
  }, [])

  // Seed with last 5 blocks on mount
  useEffect(() => {
    let cancelled = false
    async function seed() {
      try {
        const latest = await rpc.getBlockNumber()
        setBlockNumber(latest)
        if (cancelled) return
        // Fetch last 3 blocks to seed feed
        for (let b = latest; b > latest - 3; b--) {
          if (cancelled) return
          await fetchBlockEvents(b)
        }
      } catch { }
    }
    seed()
    return () => { cancelled = true }
  }, [fetchBlockEvents])

  // Poll for new blocks every 2s — more reliable than ethers HTTP provider event emission
  // which can silently stop after RPC timeouts.
  useEffect(() => {
    let lastBlock = 0
    const poll = async () => {
      try {
        const current = await rpc.getBlockNumber()
        if (current !== lastBlock) {
          lastBlock = current
          setBlockNumber(current)
          fetchBlockEvents(current)
        }
      } catch {
        // RPC hiccup — will retry next interval
      }
    }
    poll() // immediate first call
    const id = setInterval(poll, 2_000)
    return () => clearInterval(id)
  }, [fetchBlockEvents])

  // Age ticker — update ageSeconds every second
  useEffect(() => {
    const id = setInterval(() => {
      setFeed(prev => prev.map(tx => ({
        ...tx,
        ageSeconds: Math.floor(
          (Date.now() - (blockTimes.current.get(tx.blockNumber) ?? Date.now())) / 1000
        ),
      })))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return { feed, blockNumber }
}

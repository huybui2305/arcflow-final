'use client'

import { RefreshCw, ExternalLink, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { useTxHistory } from '@/lib/hooks'
import { useWallet } from '@/lib/wallet'
import { ARC_TESTNET } from '@/lib/arc'

export default function TxHistory() {
  const { address, isConnected } = useWallet()
  const { txs, loading, refresh } = useTxHistory(address)

  return (
    <section id="history" style={{ padding: '0 0 60px' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="gcard" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 className="font-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>My Transactions</h3>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {isConnected ? 'Real transfers from Arc Testnet blockchain' : 'Connect wallet to see your history'}
              </p>
            </div>
            <button
              className="btn btn-ghost"
              onClick={refresh}
              disabled={loading || !isConnected}
              style={{ padding: '7px 12px', fontSize: 12 }}
            >
              <RefreshCw size={12} className={loading ? 'anim-spin' : ''} />
              Refresh
            </button>
          </div>

          {!isConnected ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: 13 }}>
              Connect your wallet to see transaction history on Arc Testnet
            </div>
          ) : loading && txs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: 13 }}>
              <RefreshCw size={16} className="anim-spin" style={{ marginBottom: 8 }} />
              <br />Scanning Arc Testnet for your transactions…
            </div>
          ) : txs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>No recent USDC transfers found in the last 200 blocks.</div>
              <a href={ARC_TESTNET.faucet} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', fontSize: 12, marginTop: 6, display: 'inline-block' }}>
                Get testnet USDC from Circle Faucet ↗
              </a>
            </div>
          ) : (
            <div className="tx-scroll">
              {txs.map(tx => (
                <div
                  key={tx.hash}
                  onClick={() => window.open(`${ARC_TESTNET.explorer}/tx/${tx.hash}`, '_blank')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 16px', borderRadius: 11,
                    background: 'rgba(12,26,46,.5)', marginBottom: 6,
                    cursor: 'pointer', transition: 'background .2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(12,26,46,.85)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(12,26,46,.5)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: tx.type === 'sent' ? 'rgba(255,107,53,.12)' : 'rgba(0,255,148,.1)',
                    }}>
                      {tx.type === 'sent'
                        ? <ArrowUpRight size={16} color="var(--orange)" />
                        : <ArrowDownLeft size={16} color="var(--green)" />
                      }
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 7px', borderRadius: 5,
                          background: tx.type === 'sent' ? 'rgba(255,107,53,.1)' : 'rgba(0,255,148,.1)',
                          color: tx.type === 'sent' ? 'var(--orange)' : 'var(--green)',
                        }}>
                          {tx.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="font-mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
                        {tx.hash.slice(0, 14)}…{tx.hash.slice(-6)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-display" style={{
                      fontWeight: 700, fontSize: 14,
                      color: tx.type === 'sent' ? 'var(--orange)' : 'var(--green)',
                    }}>
                      {tx.type === 'sent' ? '-' : '+'}{tx.value} USDC
                    </div>
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                      Block #{tx.blockNumber.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {txs.length > 0 && (
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <a
                href={`${ARC_TESTNET.explorer}/address/${address}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ fontSize: 12, padding: '7px 14px' }}
              >
                <ExternalLink size={12} /> View all on Explorer
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Send, BarChart3, ArrowRight, ExternalLink } from 'lucide-react'
import { useLiveFeed, useNetworkVolume } from '@/lib/hooks'
import { useWallet } from '@/lib/wallet'
import ConnectModal from './ConnectModal'
import { ARC_TESTNET } from '@/lib/arc'

export default function HeroSection() {
  const { feed, blockNumber } = useLiveFeed()
  const { totalVolume, txCount, loading: volLoading } = useNetworkVolume()
  const { isConnected } = useWallet()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '15%', left: '5%', width: 580, height: 580, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,.06) 0%, transparent 65%)', pointerEvents: 'none' }} className="anim-float" />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,148,.04) 0%, transparent 65%)', pointerEvents: 'none', animationDelay: '4s' }} className="anim-float" />

        <div className="max-w-6xl mx-auto px-6 w-full" style={{ paddingTop: 40, paddingBottom: 60, position: 'relative' }}>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>

            {/* Left */}
            <div className="anim-slide">
              <div className="eyebrow">
                <div className="eyebrow-line" />
                <span className="eyebrow-text">Arc Network · EVM · Circle CCTP · USDC Gas</span>
              </div>

              <h1 className="font-display" style={{ fontWeight: 900, letterSpacing: '-.045em', lineHeight: .92, marginBottom: 22 }}>
                <span style={{ display: 'block', fontSize: 'clamp(44px,5.5vw,74px)', color: '#fff' }}>Global Money.</span>
                <span style={{ display: 'block', fontSize: 'clamp(44px,5.5vw,74px)', color: '#fff' }}>Sub-Second</span>
                <span className="grad-text" style={{ display: 'block', fontSize: 'clamp(44px,5.5vw,74px)' }}>Settlement.</span>
              </h1>

              <p style={{ fontSize: 15.5, lineHeight: 1.78, color: 'var(--sub)', maxWidth: 440, marginBottom: 30 }}>
                The first payment app built natively on Arc — Circle's Economic OS for the internet.
                Send USDC across corridors with deterministic finality and fixed $0.001 fees.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
                <button
                  className="btn btn-primary"
                  onClick={() => isConnected ? document.getElementById('send')?.scrollIntoView({ behavior: 'smooth' }) : setShowModal(true)}
                >
                  <Send size={14} />
                  {isConnected ? 'Send USDC' : 'Launch App'}
                </button>
                <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Get Testnet USDC
                </a>
              </div>

              {/* Live on-chain stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
                {[
                  {
                    num: volLoading ? '…' : `$${totalVolume}`,
                    label: 'Testnet vol (200 blks)',
                    live: true,
                  },
                  {
                    num: volLoading ? '…' : txCount.toLocaleString(),
                    label: 'On-chain txs',
                    live: true,
                  },
                  { num: '$0.001', label: 'Fixed gas fee', live: false },
                  {
                    num: blockNumber ? `#${blockNumber.toLocaleString()}` : '…',
                    label: 'Latest block',
                    live: true,
                  },
                ].map(s => (
                  <div key={s.label}>
                    <div className="font-display" style={{ fontSize: 'clamp(14px,2vw,26px)', fontWeight: 900, color: s.live ? 'var(--cyan)' : '#fff', letterSpacing: '-.04em', lineHeight: 1 }}>
                      {s.num}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Real-time TX feed */}
            <div className="anim-fade" style={{ animationDelay: '.3s', opacity: 0 }}>
              <div style={{
                borderRadius: 20, padding: 1.5,
                background: 'linear-gradient(135deg, rgba(0,229,255,.3), rgba(0,255,148,.06) 50%, rgba(0,229,255,.18))',
              }}>
                <div style={{ borderRadius: 19, background: 'var(--surface)', padding: 22 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                      <BarChart3 size={14} color="var(--cyan)" />
                      Live Transactions
                    </div>
                    <span className="badge badge-live">
                      <span className="anim-pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                      LIVE
                    </span>
                  </div>

                  {/* TX rows */}
                  <div>
                    {feed.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--muted)', fontSize: 12 }}>
                        <div className="anim-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', marginBottom: 10 }} />
                        <div>Listening for on-chain transfers…</div>
                        <div style={{ fontSize: 10, marginTop: 4, color: '#2a3a50' }}>Arc Testnet · ~0.8s blocks</div>
                      </div>
                    ) : (
                      feed.map((tx, i) => (
                        <div
                          key={tx.hash}
                          className="anim-flowin"
                          onClick={() => window.open(`${ARC_TESTNET.explorer}/tx/${tx.hash}`, '_blank')}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 13px', borderRadius: 10,
                            background: i === 0 ? 'rgba(0,229,255,.05)' : 'rgba(20,36,58,.4)',
                            marginBottom: 5, cursor: 'pointer',
                            transition: 'background .2s',
                            border: i === 0 ? '1px solid rgba(0,229,255,.1)' : '1px solid transparent',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(20,36,58,.7)')}
                          onMouseLeave={e => (e.currentTarget.style.background = i === 0 ? 'rgba(0,229,255,.05)' : 'rgba(20,36,58,.4)')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: '50%',
                              background: 'rgba(0,229,255,.1)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, color: 'var(--cyan)', fontWeight: 700,
                            }}>
                              ↗
                            </div>
                            <div>
                              <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--sub)' }}>
                                {tx.from} <ArrowRight size={8} style={{ display: 'inline', verticalAlign: 'middle' }} /> {tx.to}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                                <code style={{ fontSize: 9.5, color: '#3d5269' }}>
                                  {tx.hash.slice(0, 10)}…{tx.hash.slice(-6)}
                                </code>
                                <ExternalLink size={8} color="#3d5269" />
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="font-display" style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>
                              ${tx.amount}
                            </div>
                            <div className="font-mono" style={{ fontSize: 10, color: 'var(--green)', marginTop: 1 }}>
                              {tx.ageSeconds === 0 ? 'just now' : `${tx.ageSeconds}s ago`}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(20,36,58,.9)', marginTop: 6 }}>
                    <span className="font-mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
                      Arc Testnet · Block {blockNumber ? `#${blockNumber.toLocaleString()}` : '—'}
                    </span>
                    <span className="font-mono" style={{ fontSize: 10, color: 'var(--cyan)' }}>~0.8s finality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && <ConnectModal onClose={() => setShowModal(false)} />}
    </>
  )
}

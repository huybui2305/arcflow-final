'use client'

import { useEffect, useState } from 'react'
import { Send, BarChart3, ArrowRight } from 'lucide-react'
import { useLiveFeed } from '@/lib/hooks'
import { useWallet } from '@/lib/wallet'
import ConnectModal from './ConnectModal'

function counter(from: number, to: number, ms: number, setter: (v: number) => void) {
  const steps = 60, step = ms / steps
  let i = 0
  const t = setInterval(() => {
    i++
    const ease = 1 - Math.pow(1 - i / steps, 3)
    setter(Math.floor(from + (to - from) * ease))
    if (i >= steps) clearInterval(t)
  }, step)
}

export default function HeroSection() {
  const { feed, blockNumber } = useLiveFeed()
  const { isConnected } = useWallet()
  const [showModal, setShowModal] = useState(false)
  const [vol, setVol] = useState(0)
  const [txs, setTxs] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      counter(0, 4200, 2200, setVol)
      counter(0, 284729, 2200, setTxs)
    }, 400)
    return () => clearTimeout(t)
  }, [])

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
                Send USDC across 148+ corridors with deterministic finality and fixed $0.001 fees.
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

              {/* Live numbers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
                {[
                  { num: `$${(vol / 1000).toFixed(1)}B`, label: 'Settled today' },
                  { num: txs.toLocaleString(), label: 'Transactions' },
                  { num: '$0.001', label: 'Fixed gas' },
                  { num: '148+', label: 'Corridors' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="font-display" style={{ fontSize: 'clamp(20px,2.5vw,32px)', fontWeight: 900, color: '#fff', letterSpacing: '-.04em', lineHeight: 1 }}>
                      {s.num}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live TX feed */}
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
                    {feed.map((tx, i) => (
                      <div
                        key={tx.id}
                        className="anim-flowin"
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 15 }}>
                            <span>{tx.flagFrom}</span>
                            <ArrowRight size={9} color="var(--muted)" />
                            <span>{tx.flagTo}</span>
                          </div>
                          <div>
                            <div className="font-mono" style={{ fontSize: 10, color: 'var(--sub)' }}>{tx.id}</div>
                            <div style={{ fontSize: 10.5, color: '#3d5269', marginTop: 1 }}>{tx.from} → {tx.to}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className="font-display" style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>${tx.amount}</div>
                          <div className="font-mono" style={{ fontSize: 10, color: 'var(--green)', marginTop: 1 }}>{tx.age}</div>
                        </div>
                      </div>
                    ))}
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

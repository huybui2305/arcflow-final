'use client'

import { TrendingUp, RefreshCw } from 'lucide-react'
import { useNetworkVolume, useNetworkStats } from '@/lib/hooks'

// Static chart shape — replaced with live accumulator in a full prod build
const CHART = [
  { h: '00', v: 42 }, { h: '02', v: 28 }, { h: '04', v: 18 }, { h: '06', v: 35 }, { h: '08', v: 68 },
  { h: '10', v: 82 }, { h: '12', v: 95 }, { h: '14', v: 88 }, { h: '16', v: 74 }, { h: '18', v: 91 },
  { h: '20', v: 78 }, { h: '22', v: 62 },
]
const maxV = Math.max(...CHART.map(d => d.v))

export default function StatsAndAnalytics() {
  const vol = useNetworkVolume()
  const { blockNumber } = useNetworkStats()

  const STATS = [
    {
      icon: '💵',
      val: vol.loading ? '…' : `$${vol.totalVolume}`,
      label: 'USDC Settled',
      sub: 'last 200 blocks · live',
      up: true,
    },
    {
      icon: '⚡',
      val: '~0.8s',
      label: 'Avg Finality',
      sub: 'Malachite BFT',
      up: true,
    },
    {
      icon: '🔁',
      val: vol.loading ? '…' : vol.txCount.toLocaleString(),
      label: 'Transfers',
      sub: 'last 200 blocks · live',
      up: true,
    },
    {
      icon: '🛡',
      val: '$0.001',
      label: 'Gas (USDC)',
      sub: 'Fixed fee',
      up: false,
    },
  ]

  return (
    <>
      {/* Stats */}
      <section id="stats" style={{ padding: '60px 0 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Live Network Stats</span>
            {vol.loading ? (
              <RefreshCw size={10} className="anim-spin" style={{ color: 'var(--cyan)', marginLeft: 4 }} />
            ) : (
              <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--green)', marginLeft: 4 }}>
                ● LIVE · Block #{blockNumber?.toLocaleString() ?? '…'}
              </span>
            )}
          </div>

          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {STATS.map(s => (
              <div key={s.label} className="gcard" style={{ padding: 22, cursor: 'default' }}>
                <div style={{ fontSize: 22, marginBottom: 14 }}>{s.icon}</div>
                <div className="font-display" style={{ fontSize: 26, fontWeight: 900, color: s.up ? 'var(--cyan)' : 'var(--text)', letterSpacing: '-.03em', marginBottom: 4 }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
                <span className="font-mono" style={{
                  fontSize: 9.5, padding: '2px 8px', borderRadius: 20,
                  background: s.up ? 'rgba(0,229,255,.08)' : 'rgba(0,255,148,.08)',
                  color: s.up ? 'var(--cyan)' : 'var(--green)',
                }}>
                  {s.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section id="analytics" style={{ padding: '60px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Network Analytics</span>
          </div>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 14 }}>

            {/* Chart */}
            <div className="gcard" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div className="font-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Settlement Volume (session)</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    USDC · Arc Testnet ·{' '}
                    <span style={{ color: 'var(--cyan)' }}>
                      {vol.loading ? 'loading…' : `$${vol.totalVolume} in ${vol.blockWindow} blocks`}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)' }}>
                  <TrendingUp size={12} />
                  Arc Testnet Live
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 110 }}>
                {CHART.map((d, i) => {
                  const pct = (d.v / maxV) * 100
                  const isHigh = d.v > 80
                  const bg = isHigh ? 'linear-gradient(180deg,#00e5ff,#00b4d8)' : d.v > 60 ? 'rgba(0,229,255,.5)' : 'rgba(0,229,255,.2)'
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%' }}>
                      <div
                        style={{ width: '100%', borderRadius: '2px 2px 0 0', minHeight: 3, background: bg, height: `${pct}%`, opacity: .65, transition: 'opacity .2s', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '.65')}
                      />
                      <span className="font-mono" style={{ fontSize: 8.5, color: '#384f68' }}>{d.h}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Live stats summary */}
            <div className="gcard" style={{ padding: 22 }}>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 20 }}>
                Chain Stats
              </div>
              {[
                { label: 'USDC Volume (200 blks)', val: vol.loading ? '…' : `$${vol.totalVolume}`, color: 'var(--cyan)' },
                { label: 'Transfers (200 blks)', val: vol.loading ? '…' : vol.txCount.toLocaleString(), color: 'var(--green)' },
                { label: 'Avg Gas Fee', val: '$0.001 USDC', color: 'var(--text)' },
                { label: 'Avg Finality', val: '~0.8s', color: 'var(--green)' },
                { label: 'Latest Block', val: blockNumber ? `#${blockNumber.toLocaleString()}` : '…', color: 'var(--cyan)' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--sub)' }}>{r.label}</span>
                  <span className="font-mono" style={{ fontSize: 12, color: r.color, fontWeight: 600 }}>{r.val}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(20,36,58,.9)', fontSize: 10, color: '#2a3a50', fontFamily: 'var(--font-mono)' }}>
                Data from Arc Testnet RPC · refreshes every 30s
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

'use client'

import { DollarSign, Zap, Globe, Shield, TrendingUp } from 'lucide-react'

const STATS = [
  { icon: '💵', val: '$4.2B',   label: 'Settled Today',    badge: '+12.4%', up: true },
  { icon: '⚡', val: '0.8s',    label: 'Avg Finality',     badge: '-0.1s',  up: true },
  { icon: '🌐', val: '148',     label: 'Active Corridors', badge: '+6 new', up: true },
  { icon: '🛡', val: '$0.001',  label: 'Gas (USDC)',       badge: 'Fixed',  up: false },
]

const CHART = [
  { h:'00',v:42},{ h:'02',v:28},{ h:'04',v:18},{ h:'06',v:35},{ h:'08',v:68},
  { h:'10',v:82},{ h:'12',v:95},{ h:'14',v:88},{ h:'16',v:74},{ h:'18',v:91},
  { h:'20',v:78},{ h:'22',v:62},
]
const maxV = Math.max(...CHART.map(d => d.v))

const CORRIDORS = [
  { name:'US → EU',   vol:'$1.2B', share:78, trend:'+8%',  c:'linear-gradient(90deg,#00e5ff,#00b4d8)'},
  { name:'APAC → ME', vol:'$840M', share:54, trend:'+22%', c:'rgba(0,229,255,.55)'},
  { name:'LATAM → US',vol:'$620M', share:40, trend:'+15%', c:'rgba(0,229,255,.4)'},
  { name:'EU → APAC', vol:'$490M', share:31, trend:'+5%',  c:'rgba(0,229,255,.28)'},
]

export default function StatsAndAnalytics() {
  return (
    <>
      {/* Stats */}
      <section id="stats" style={{ padding: '60px 0 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {STATS.map(s => (
              <div key={s.label} className="gcard" style={{ padding: 22, cursor: 'default' }}>
                <div style={{ fontSize: 22, marginBottom: 14 }}>{s.icon}</div>
                <div className="font-display" style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)', letterSpacing: '-.03em', marginBottom: 4 }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{s.label}</div>
                <span className="font-mono" style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20,
                  background: s.up ? 'rgba(0,255,148,.08)' : 'rgba(0,229,255,.08)',
                  color: s.up ? 'var(--green)' : 'var(--cyan)',
                }}>
                  {s.badge}
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
                  <div className="font-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Settlement Volume (24h)</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>USDC · Arc Testnet</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)' }}>
                  <TrendingUp size={12} />
                  +18.4% vs yesterday
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

            {/* Corridors */}
            <div className="gcard" style={{ padding: 22 }}>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 20 }}>Top Corridors</div>
              {CORRIDORS.map(c => (
                <div key={c.name} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--sub)' }}>{c.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="font-mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>{c.vol}</span>
                      <span className="font-mono" style={{ fontSize: 10, color: 'var(--green)' }}>{c.trend}</span>
                    </div>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'rgba(20,36,58,.9)' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: c.c, width: `${c.share}%`, transition: 'width 1.2s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

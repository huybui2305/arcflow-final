'use client'

import { ARC_TESTNET } from '@/lib/arc'

const FEATURES = [
  { icon:'⚡', title:'Deterministic Finality',   desc:"Malachite BFT ensures every tx settles under 1 second with cryptographic certainty. No re-orgs, no waiting.",   tag:'Core Protocol', c:'#00e5ff' },
  { icon:'💵', title:'Stable Fee Design',         desc:'Pay gas in USDC at fixed rates. No ETH volatility, no gas wars. Enterprise teams can budget transactions exactly.',  tag:'Treasury',      c:'#00ff94' },
  { icon:'🛡', title:'Opt-in Privacy',            desc:'Configure visibility per use case — public by default, private for sensitive institutional transactions.',             tag:'Compliance',    c:'#7c3aed' },
  { icon:'🌐', title:'Circle CCTP V2',            desc:"Native cross-chain USDC via Circle's CCTP V2. Move liquidity across 20+ chains without bridging risk.",              tag:'Multichain',    c:'#ff6b35' },
  { icon:'🔧', title:'EVM Compatible',             desc:'Deploy existing Solidity contracts with zero modifications. Hardhat, Foundry, viem, ethers.js — all work out of the box.',  tag:'Developer',     c:'#00e5ff' },
  { icon:'🤖', title:'Agentic Commerce',           desc:'AI agents and IoT devices transact natively. Machine-to-machine payment rails for the era of autonomous economies.',  tag:'Future',        c:'#00ff94' },
]

export function FeaturesSection() {
  return (
    <section style={{ padding: '60px 0', background: 'linear-gradient(180deg,transparent,rgba(0,229,255,.012),transparent)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 14 }}>
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Why Arc Network</span>
            <div className="eyebrow-line" />
          </div>
          <h2 className="font-display" style={{ fontWeight: 900, fontSize: 'clamp(28px,3.5vw,46px)', letterSpacing: '-.04em', lineHeight: .95 }}>
            <span style={{ display: 'block', color: '#fff' }}>Infrastructure built</span>
            <span className="grad-text" style={{ display: 'block' }}>for real-world money.</span>
          </h2>
        </div>
        <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {FEATURES.map(f => (
            <div
              key={f.title}
              style={{ padding: 22, borderRadius: 14, background: 'var(--card)', border: '1px solid rgba(26,37,64,.8)', cursor: 'pointer', transition: 'all .3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,37,64,.8)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${f.c}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {f.icon}
                </div>
                <span className="font-mono" style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 5, background: `${f.c}12`, color: f.c }}>
                  {f.tag}
                </span>
              </div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 7 }}>{f.title}</div>
              <p style={{ fontSize: 12.5, lineHeight: 1.65, color: 'var(--muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section style={{ padding: '60px 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div style={{
          borderRadius: 22, padding: '56px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg,rgba(0,229,255,.055),rgba(0,255,148,.018),rgba(0,229,255,.055))',
          border: '1px solid rgba(0,229,255,.12)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,.09) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <h2 className="font-display" style={{ fontWeight: 900, fontSize: 'clamp(30px,4vw,52px)', letterSpacing: '-.04em', lineHeight: .95, marginBottom: 14 }}>
              <span style={{ display: 'block', color: '#fff' }}>Build on Arc.</span>
              <span className="grad-text" style={{ display: 'block' }}>Ship today.</span>
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--muted)', maxWidth: 380, margin: '0 auto 28px', lineHeight: 1.7 }}>
              Deploy smart contracts in minutes. Get testnet USDC from Circle's faucet and start sending real payments on Arc Testnet.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://docs.arc.network/arc/tutorials/deploy-on-arc" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Deploy on Arc ↗
              </a>
              <a href={ARC_TESTNET.faucet} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Get Testnet USDC
              </a>
              <a href={ARC_TESTNET.explorer} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Explorer ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{ padding: '36px 0', borderTop: '1px solid rgba(20,36,58,.9)' }}>
      <div className="max-w-6xl mx-auto px-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#00e5ff,#00b4d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 900, color: '#030b15', fontSize: 12 }}>A</div>
          <span className="font-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>Arc<span style={{ color: 'var(--cyan)' }}>Flow</span></span>
          <span className="badge badge-cyan" style={{ fontSize: 9 }}>Built on Arc Network</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Docs', href: 'https://docs.arc.network' },
            { label: 'Discord', href: 'https://discord.com/invite/buildonarc' },
            { label: 'Twitter', href: 'https://x.com/arc' },
            { label: 'Explorer', href: ARC_TESTNET.explorer },
            { label: 'Faucet', href: ARC_TESTNET.faucet },
            { label: 'GitHub', href: 'https://github.com' },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--cyan)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >{l.label}</a>
          ))}
        </div>
        <span className="font-mono" style={{ fontSize: 10, color: '#2a3a50' }}>© 2025 ArcFlow · Open source · MIT</span>
      </div>
    </footer>
  )
}

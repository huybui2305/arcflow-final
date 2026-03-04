'use client'

import { X, AlertCircle } from 'lucide-react'
import { useWallet } from '@/lib/wallet'
import { ARC_TESTNET } from '@/lib/arc'

export default function ConnectModal({ onClose }: { onClose: () => void }) {
  const { connect, isConnecting, error } = useWallet()

  const handleConnect = async () => {
    await connect()
    if (!error) onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,11,21,.88)', backdropFilter: 'blur(8px)' }} onClick={onClose} />

      {/* Box */}
      <div className="anim-slide" style={{
        position: 'relative',
        background: 'var(--card)',
        border: '1px solid rgba(0,229,255,.18)',
        borderRadius: 20, padding: 32,
        width: '100%', maxWidth: 380,
        boxShadow: '0 40px 80px rgba(0,0,0,.6)',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
          <X size={18} />
        </button>

        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
          Connect Wallet
        </h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
          Arc Testnet will be added to your wallet automatically.
        </p>

        {/* Wallet options */}
        {[
          { icon: '🦊', name: 'MetaMask', desc: 'Browser extension wallet', bg: 'rgba(245,130,32,.1)' },
          { icon: '🔵', name: 'Coinbase Wallet', desc: 'Mobile & browser wallet', bg: 'rgba(0,129,255,.1)' },
          { icon: '💎', name: 'Any EVM Wallet', desc: 'window.ethereum provider', bg: 'rgba(0,229,255,.08)' },
        ].map(w => (
          <button
            key={w.name}
            onClick={handleConnect}
            disabled={isConnecting}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%', padding: '14px 16px',
              borderRadius: 12, background: 'var(--surface)',
              border: '1px solid rgba(30,45,69,.9)',
              cursor: 'pointer', marginBottom: 10,
              transition: 'all .2s', textAlign: 'left',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,.3)'; e.currentTarget.style.background = 'rgba(0,229,255,.04)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(30,45,69,.9)'; e.currentTarget.style.background = 'var(--surface)' }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {isConnecting ? <span style={{ fontSize: 16 }}>⏳</span> : w.icon}
            </div>
            <div>
              <div className="font-display" style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{w.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{w.desc}</div>
            </div>
          </button>
        ))}

        {error && (
          <div className="status status-error" style={{ marginTop: 12 }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        {/* Network info */}
        <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'rgba(0,229,255,.03)', border: '1px solid rgba(0,229,255,.08)' }}>
          <div className="font-mono" style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.8 }}>
            <div>RPC: <span style={{ color: 'var(--cyan)' }}>{ARC_TESTNET.rpc}</span></div>
            <div>Chain ID: <span style={{ color: 'var(--cyan)' }}>{ARC_TESTNET.chainId}</span></div>
            <div>Gas Token: <span style={{ color: 'var(--green)' }}>USDC (fixed $0.001)</span></div>
          </div>
        </div>

        <p style={{ marginTop: 12, fontSize: 11.5, color: 'var(--muted)', textAlign: 'center' }}>
          Need USDC?{' '}
          <a href={ARC_TESTNET.faucet} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>
            Get it from Circle Faucet ↗
          </a>
        </p>
      </div>
    </div>
  )
}

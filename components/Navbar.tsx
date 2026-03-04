'use client'

import { useState, useEffect } from 'react'
import { Wallet, LogOut, Zap, ExternalLink, ChevronDown } from 'lucide-react'
import { useWallet } from '@/lib/wallet'
import { ARC_TESTNET } from '@/lib/arc'
import ConnectModal from './ConnectModal'

export default function Navbar() {
  const { isConnected, address, shortAddress, balances, disconnect } = useWallet()
  const [scrolled, setScrolled] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={scrolled ? {
          background: 'rgba(7,17,31,.94)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(0,229,255,.07)',
        } : {}}
      >
        <div className="max-w-6xl mx-auto px-6" style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, #00e5ff, #00b4d8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-syne)', fontWeight: 900, color: '#030b15', fontSize: 14,
            }}>A</div>
            <span className="font-display" style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)', letterSpacing: '-.02em' }}>
              Arc<span style={{ color: 'var(--cyan)' }}>Flow</span>
            </span>
          </a>

          {/* Nav links */}
          <div className="hide-mobile" style={{ display: 'flex', gap: 28 }}>
            {[
              { label: 'Dashboard', href: '#stats' },
              { label: 'Send', href: '#send' },
              { label: 'History', href: '#history' },
              { label: 'Analytics', href: '#analytics' },
            ].map(item => (
              <a key={item.label} href={item.href}
                className="font-display"
                style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none', transition: 'color .2s', fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--cyan)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >{item.label}</a>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-live hide-mobile">
              <span className="anim-pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              TESTNET
            </span>

            {isConnected ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDropdown(p => !p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', borderRadius: 10,
                    background: 'rgba(0,229,255,.06)',
                    border: '1px solid rgba(0,229,255,.15)',
                    cursor: 'pointer', transition: 'all .2s',
                  }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)' }} />
                  <span className="font-mono" style={{ fontSize: 12, color: 'var(--cyan)' }}>{shortAddress}</span>
                  <span className="font-mono" style={{ fontSize: 11, color: 'var(--green)' }}>{balances.USDC} USDC</span>
                  <ChevronDown size={12} color="var(--muted)" />
                </button>

                {showDropdown && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 8,
                    background: 'var(--card)', border: '1px solid rgba(0,229,255,.15)',
                    borderRadius: 12, padding: 14, minWidth: 220, zIndex: 100,
                    boxShadow: '0 20px 60px rgba(0,0,0,.5)',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
                      {address?.slice(0, 14)}...{address?.slice(-6)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: 'var(--muted)' }}>USDC</span>
                        <span className="font-mono" style={{ color: 'var(--green)' }}>{balances.USDC}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: 'var(--muted)' }}>EURC</span>
                        <span className="font-mono" style={{ color: 'var(--green)' }}>{balances.EURC}</span>
                      </div>
                    </div>
                    <a
                      href={`${ARC_TESTNET.explorer}/address/${address}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn btn-ghost"
                      style={{ width: '100%', justifyContent: 'center', padding: '7px', marginBottom: 8, fontSize: 12 }}
                    >
                      <ExternalLink size={12} /> View on Explorer
                    </a>
                    <button
                      onClick={() => { disconnect(); setShowDropdown(false) }}
                      className="btn btn-danger"
                      style={{ width: '100%', justifyContent: 'center', padding: '7px', fontSize: 12 }}
                    >
                      <LogOut size={12} /> Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <Wallet size={13} />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      {showModal && <ConnectModal onClose={() => setShowModal(false)} />}

      {/* Close dropdown on outside click */}
      {showDropdown && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 49 }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </>
  )
}

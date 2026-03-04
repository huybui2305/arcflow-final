'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2, ExternalLink, RefreshCw } from 'lucide-react'
import { ethers } from 'ethers'
import { useWallet } from '@/lib/wallet'
import { sendUSDC } from '@/lib/send'
import { ARC_TESTNET } from '@/lib/arc'
import ConnectModal from './ConnectModal'

type Status = 'idle' | 'pending' | 'success' | 'error'

export default function SendSection() {
  const { isConnected, signer, balances, refreshBalances } = useWallet()
  const [showModal, setShowModal] = useState(false)

  const [amount, setAmount] = useState('')
  const [toAddr, setToAddr] = useState('')
  const [token, setToken] = useState<'USDC' | 'EURC'>('USDC')
  const [fromRegion, setFromRegion] = useState('🇺🇸 United States')
  const [toRegion, setToRegion] = useState('🇦🇪 UAE')

  const [status, setStatus] = useState<Status>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [txHash, setTxHash] = useState('')
  const [confirmMs, setConfirmMs] = useState(0)

  const balance = token === 'USDC' ? balances.USDC : balances.EURC
  const receiveAmt = amount ? parseFloat(amount).toFixed(4) : '—'

  const handleSend = async () => {
    if (!isConnected || !signer) { setShowModal(true); return }

    const amtNum = parseFloat(amount)
    if (!amount || amtNum <= 0) { setStatus('error'); setStatusMsg('Enter a valid amount.'); return }
    if (!ethers.isAddress(toAddr)) { setStatus('error'); setStatusMsg('Invalid recipient address.'); return }
    if (amtNum > parseFloat(balance)) { setStatus('error'); setStatusMsg(`Insufficient ${token} balance (you have ${balance}).`); return }

    setStatus('pending')
    setStatusMsg('Waiting for wallet approval…')

    try {
      setStatusMsg('Transaction submitted — waiting for Arc confirmation…')
      const result = await sendUSDC(signer, toAddr, amount, token)

      setTxHash(result.hash)
      setConfirmMs(result.confirmedAt)
      setStatus('success')
      setStatusMsg(`Confirmed in ${(result.confirmedAt / 1000).toFixed(2)}s!`)

      // Reset form
      setAmount('')
      setToAddr('')

      // Refresh balance
      await refreshBalances()
    } catch (e: any) {
      setStatus('error')
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') setStatusMsg('Transaction rejected by user.')
      else setStatusMsg((e.reason || e.message || 'Transaction failed').slice(0, 160))
    }
  }

  return (
    <>
      <section id="send" style={{ padding: '80px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>

            {/* Left: copy */}
            <div>
              <div className="eyebrow">
                <div className="eyebrow-line" />
                <span className="eyebrow-text">Send Payment</span>
              </div>
              <h2 className="font-display" style={{ fontWeight: 900, fontSize: 'clamp(28px,3.5vw,46px)', letterSpacing: '-.04em', lineHeight: .95, marginBottom: 14 }}>
                <span style={{ display: 'block', color: '#fff' }}>Move money</span>
                <span className="grad-text" style={{ display: 'block' }}>at light speed.</span>
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: 'var(--sub)', maxWidth: 400 }}>
                No SWIFT. No banks. No surprise fees. Just instant USDC or EURC settlement powered by Arc's Malachite BFT consensus.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
                {[
                  ['⚡', 'Sub-second finality — deterministic, not probabilistic'],
                  ['💵', '$0.001 USDC gas — fixed and budget-friendly'],
                  ['🔒', 'USDC & EURC natively supported on Arc'],
                  ['🌐', 'EVM compatible — all existing tools work'],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--sub)' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,229,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>
                      {icon}
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="gcard" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <span className="font-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>New Transfer</span>
                <span className="badge badge-cyan">Arc Testnet</span>
              </div>

              {/* Token selector */}
              <div style={{ marginBottom: 14 }}>
                <label className="font-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Token</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['USDC', 'EURC'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setToken(t)}
                      style={{
                        flex: 1, padding: '9px 0', borderRadius: 10, cursor: 'pointer',
                        fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 13,
                        transition: 'all .2s',
                        background: token === t ? 'linear-gradient(135deg, #00e5ff, #00b4d8)' : 'var(--surface)',
                        color: token === t ? '#030b15' : 'var(--muted)',
                        border: token === t ? 'none' : '1px solid rgba(30,45,69,.9)',
                      }}
                    >
                      {t === 'USDC' ? '💵' : '💶'} {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: 14 }}>
                <label className="font-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Amount</label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
                  borderRadius: 12, background: 'var(--surface)',
                  border: `1px solid ${amount ? 'rgba(0,229,255,.35)' : 'rgba(30,45,69,.9)'}`,
                  transition: 'border-color .2s',
                }}>
                  <input
                    type="number" min="0" step="0.01" placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: 24, color: 'var(--text)', letterSpacing: '-.02em', width: 0 }}
                  />
                  <span style={{ padding: '4px 9px', borderRadius: 7, background: 'rgba(0,229,255,.1)', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {token}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5, fontFamily: 'var(--font-mono)' }}>
                  Balance: <span style={{ color: 'var(--cyan)' }}>{isConnected ? `${balance} ${token}` : '— (connect wallet)'}</span>
                </div>
              </div>

              {/* Recipient */}
              <div style={{ marginBottom: 14 }}>
                <label className="font-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Recipient Address</label>
                <input
                  className="inp font-mono"
                  type="text" placeholder="0x..."
                  value={toAddr}
                  onChange={e => setToAddr(e.target.value)}
                  style={{ fontSize: 12 }}
                />
              </div>

              {/* Corridor selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                  <label className="font-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>From</label>
                  <select className="inp" value={fromRegion} onChange={e => setFromRegion(e.target.value)}>
                    {['🇺🇸 United States','🇸🇬 Singapore','🇬🇧 United Kingdom','🇩🇪 Germany','🇯🇵 Japan'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>To</label>
                  <select className="inp" value={toRegion} onChange={e => setToRegion(e.target.value)}>
                    {['🇦🇪 UAE','🇮🇳 India','🇧🇷 Brazil','🇰🇷 South Korea','🇭🇰 Hong Kong'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Fee summary */}
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(0,229,255,.025)', border: '1px solid rgba(0,229,255,.07)', marginBottom: 14 }}>
                {[
                  ['Network fee', '$0.001 USDC', 'var(--green)'],
                  ['Settlement', '~0.8 seconds', 'var(--cyan)'],
                  ['You send', amount ? `${parseFloat(amount).toFixed(4)} ${token}` : '—', 'var(--text)'],
                  ['Recipient gets', receiveAmt === '—' ? '—' : `${receiveAmt} ${token}`, 'var(--green)'],
                ].map(([k, v, c]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 3 }}>
                    <span style={{ color: 'var(--muted)' }}>{k}</span>
                    <span className="font-mono" style={{ color: c as string, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button
                className="btn btn-primary"
                onClick={handleSend}
                disabled={status === 'pending'}
                style={{ width: '100%', justifyContent: 'center', padding: 15, fontSize: 14, borderRadius: 12 }}
              >
                {status === 'pending' ? (
                  <><Loader2 size={15} className="anim-spin" /> Confirming on Arc…</>
                ) : (
                  <><Send size={14} /> {isConnected ? `Send ${amount || '0'} ${token}` : 'Connect Wallet First'}</>
                )}
              </button>

              {/* Status messages */}
              {status === 'pending' && (
                <div className="status status-pending" style={{ marginTop: 10 }}>
                  <Loader2 size={14} className="anim-spin" style={{ flexShrink: 0 }} />
                  {statusMsg}
                </div>
              )}
              {status === 'success' && (
                <div className="status status-success" style={{ marginTop: 10 }}>
                  <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <strong>Confirmed in {(confirmMs / 1000).toFixed(2)}s</strong> on Arc Testnet!{' '}
                    <a href={`${ARC_TESTNET.explorer}/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                      View tx ↗
                    </a>
                  </div>
                </div>
              )}
              {status === 'error' && (
                <div className="status status-error" style={{ marginTop: 10 }}>
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  {statusMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showModal && <ConnectModal onClose={() => setShowModal(false)} />}
    </>
  )
}

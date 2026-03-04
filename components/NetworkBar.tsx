'use client'

import { useNetworkStats } from '@/lib/hooks'
import { ARC_TESTNET } from '@/lib/arc'

export default function NetworkBar() {
  const { blockNumber, status, gasPrice } = useNetworkStats()

  return (
    <div style={{
      marginTop: 60,
      background: 'rgba(7,17,31,.8)',
      borderBottom: '1px solid rgba(0,229,255,.06)',
      backdropFilter: 'blur(10px)',
    }}>
      <div className="max-w-6xl mx-auto px-6" style={{ display: 'flex', alignItems: 'center', gap: 28, height: 38, overflowX: 'auto' }}>
        {[
          { label: 'Network', value: ARC_TESTNET.name, color: 'var(--green)', dot: true },
          { label: 'Chain ID', value: String(ARC_TESTNET.chainId), color: 'var(--cyan)' },
          { label: 'Block', value: blockNumber ? `#${blockNumber.toLocaleString()}` : '…', color: 'var(--text)' },
          { label: 'Gas Token', value: 'USDC', color: 'var(--cyan)' },
          { label: 'Gas Fee', value: `$${gasPrice}`, color: 'var(--green)' },
          { label: 'Finality', value: '~0.8s', color: 'var(--green)' },
          { label: 'RPC', value: status === 'online' ? 'Connected ✓' : status === 'connecting' ? 'Connecting…' : 'Error ✗', color: status === 'online' ? 'var(--green)' : status === 'error' ? 'var(--orange)' : 'var(--muted)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {item.dot && (
              <div className="anim-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
            )}
            <span className="font-mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{item.label}</span>
            <span className="font-mono" style={{ fontSize: 10, fontWeight: 500, color: item.color }}>{item.value}</span>
          </div>
        ))}

        <a
          href={ARC_TESTNET.explorer}
          target="_blank" rel="noopener noreferrer"
          className="font-mono"
          style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--cyan)', textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          Explorer ↗
        </a>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { WalletProvider } from '@/lib/wallet'
import './globals.css'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','500','600','700','800','900'] })
const dm = DM_Sans({ subsets: ['latin'], variable: '--font-dm', weight: ['300','400','500'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['300','400','500'] })

export const metadata: Metadata = {
  title: 'ArcFlow — Cross-border Payments on Arc Network',
  description: 'Send USDC globally with sub-second finality. Fixed $0.001 fees. Built on Arc Network — the Economic OS for the internet.',
  openGraph: {
    title: 'ArcFlow — Cross-border Payments on Arc',
    description: 'Sub-second stablecoin payments. Fixed $0.001 fees. 148+ corridors.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dm.variable} ${mono.variable}`}>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}

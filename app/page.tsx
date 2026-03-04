import Navbar from '@/components/Navbar'
import NetworkBar from '@/components/NetworkBar'
import HeroSection from '@/components/HeroSection'
import StatsAndAnalytics from '@/components/StatsAndAnalytics'
import SendSection from '@/components/SendSection'
import TxHistory from '@/components/TxHistory'
import { FeaturesSection, CTASection, Footer } from '@/components/BottomSections'

export default function Page() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <NetworkBar />
      <HeroSection />
      <StatsAndAnalytics />
      <SendSection />
      <TxHistory />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  )
}

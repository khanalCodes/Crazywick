import type { Metadata } from 'next'
import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import TickerTape from '@/components/TickerTape'

export const metadata: Metadata = {
  title: 'CrazyWick — Financial Intelligence',
  description: 'Deep-dive articles, market predictions, and geopolitical analysis from Kathmandu.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  keywords: [
    'CrazyWick', 'Nepal finance', 'NEPSE analysis',
    'stock market predictions', 'crypto insights',
    'global markets', 'geopolitics', 'macro analysis',
  ],
  openGraph: {
    title: 'CrazyWick — Financial Intelligence Platform',
    description: 'Markets, geopolitics, and macro trends before the crowd catches on.',
    url: 'https://crazywick.com',
    siteName: 'CrazyWick',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrazyWick — Financial Intelligence Platform',
    description: 'Market intelligence, predictions, and geopolitical insights from Kathmandu.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#ffffff', color: '#1a1a18' }}>
        <div aria-hidden="true">
          <TickerTape />
        </div>
        <Navbar />
        <main>{children}</main>
        <footer style={{
          borderTop: '1px solid rgba(0,0,0,0.08)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          color: '#aaa9a0',
          fontSize: '13px',
          marginTop: '6rem',
          background: '#f7f6f3',
        }}>
          <p style={{ marginBottom: '0.5rem', fontFamily: 'var(--serif)', fontSize: '18px', color: '#1a1a18' }}>
            crazy<span style={{ color: '#1D9E75' }}>wick</span>
          </p>
          <p>© {new Date().getFullYear()} CrazyWick. Financial intelligence from Kathmandu.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '11px', color: '#bbb' }}>
            Not financial advice. Educational content only.
          </p>
        </footer>
      </body>
    </html>
  )
}
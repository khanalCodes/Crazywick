import type { Metadata } from 'next'
import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import TickerTape from '@/components/TickerTape'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: "CrazyWick — Financial Intelligence Platform",
  description:
    "CrazyWick delivers independent market insights, geopolitical analysis, and macroeconomic predictions from Kathmandu. Track global markets, crypto, and geopolitical shifts before the crowd reacts.",
  keywords: [
    "CrazyWick",
    "Nepal finance",
    "NEPSE analysis",
    "stock market predictions",
    "crypto insights",
    "global markets",
    "geopolitics",
    "macro analysis"
  ],
  openGraph: {
    title: "CrazyWick — Financial Intelligence Platform",
    description:
      "Markets, geopolitics, and macro trends before the crowd catches on.",
    url: "https://crazywick.com",
    siteName: "CrazyWick",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrazyWick — Financial Intelligence Platform",
    description:
      "Market intelligence, predictions, and geopolitical insights from Kathmandu.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ background: '#ffffff', color: '#1a1a18' }}>

        {/* Ticker should NOT dominate SEO */}
        <div role="presentation" aria-hidden="true">
          <div aria-hidden="true">
  <TickerTape />
</div>
        </div>

        <Navbar />

        <main>{children}</main>

        <footer
          style={{
            borderTop: '1px solid rgba(0,0,0,0.08)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            color: '#aaa9a0',
            fontSize: '13px',
            marginTop: '6rem',
            background: '#f7f6f3',
          }}
        >
          <p
            style={{
              marginBottom: '0.5rem',
              fontFamily: 'var(--serif)',
              fontSize: '18px',
              color: '#1a1a18',
            }}
          >
            crazy<span style={{ color: '#1D9E75' }}>wick</span>
          </p>

          <p>
            © {new Date().getFullYear()} CrazyWick. Financial intelligence from Kathmandu.
          </p>

          <p style={{ marginTop: '0.5rem', fontSize: '11px', color: '#bbb' }}>
            Not financial advice. Educational content only.
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
import { getAllArticles } from '@/lib/articles'
import Link from 'next/link'
import TradingViewChart from '@/components/TradingViewChart'

export default function GeopoliticsPage() {
  const articles = getAllArticles().filter(a => a.category === 'Geopolitics')

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
          Power, policy & markets
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '1rem' }}>
          Geopolitics
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '480px' }}>
          How political shifts, trade wars, and global power dynamics move markets.
          Written from a perspective outside the Western financial bubble.
        </p>
      </div>

      {/* Live chart */}
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem' }}>
          Live market · S&P 500
        </p>
        <TradingViewChart />
      </div>

      {/* Articles */}
      {articles.length === 0 ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-dim)' }}>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No geopolitics articles yet.</p>
          <p style={{ fontSize: '13px' }}>Add MDX files with <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>category: Geopolitics</code> to <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>content/articles/</code></p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem' }}>
            Analysis
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {articles.map(a => (
              <Link key={a.slug} href={`/articles/${a.slug}`}>
                <div style={{
                  padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                >
                  <div>
                    <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', lineHeight: 1.3, marginBottom: '0.4rem' }}>{a.title}</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{a.excerpt}</p>
                  </div>
                  <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{a.date}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>{a.readingTime}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

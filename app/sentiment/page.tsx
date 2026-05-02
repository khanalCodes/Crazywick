'use client'
import { useEffect, useState } from 'react'

const ASSETS = [
  { label: 'S&P 500', keywords: ['SPX', 'S&P 500', 'spy', 'sp500'] },
  { label: 'Nasdaq', keywords: ['QQQ', 'nasdaq', 'NDX', 'tech stocks'] },
  { label: 'Bitcoin', keywords: ['bitcoin', 'BTC', 'crypto'] },
  { label: 'Ethereum', keywords: ['ethereum', 'ETH'] },
  { label: 'Gold', keywords: ['gold', 'XAU', 'GLD'] },
  { label: 'Crude Oil', keywords: ['oil', 'crude', 'WTI', 'OPEC'] },
  { label: 'USD/INR', keywords: ['USDINR', 'rupee', 'INR'] },
  { label: 'Nifty 50', keywords: ['nifty', 'NSE', 'indian market'] },
  { label: 'Silver', keywords: ['silver', 'XAG', 'SLV'] },
  { label: 'Nvidia', keywords: ['nvidia', 'NVDA', 'AI stocks'] },
]

const SUBREDDITS = ['wallstreetbets', 'investing', 'forex', 'stocks', 'IndiaInvestments']

const BULLISH_WORDS = ['bull', 'buy', 'long', 'calls', 'moon', 'pump', 'breakout', 'upside', 'rally', 'strong', 'growth', 'bullish', 'higher', 'support', 'accumulate', 'undervalued']
const BEARISH_WORDS = ['bear', 'sell', 'short', 'puts', 'crash', 'dump', 'breakdown', 'downside', 'drop', 'weak', 'recession', 'bearish', 'lower', 'resistance', 'overvalued', 'bubble']

type Post = {
  title: string
  score: number
  url: string
  subreddit: string
  created: number
}

type AssetSentiment = {
  label: string
  bullish: number
  bearish: number
  neutral: number
  score: number // -100 to +100
  posts: Post[]
  keyPoints: string[]
}

function scoreSentiment(text: string): 'bullish' | 'bearish' | 'neutral' {
  const lower = text.toLowerCase()
  const b = BULLISH_WORDS.filter(w => lower.includes(w)).length
  const bear = BEARISH_WORDS.filter(w => lower.includes(w)).length
  if (b > bear) return 'bullish'
  if (bear > b) return 'bearish'
  return 'neutral'
}

function extractKeyPoints(posts: Post[], asset: string): string[] {
  const points: string[] = []
  const sorted = [...posts].sort((a, b) => b.score - a.score).slice(0, 5)
  sorted.forEach(p => {
    const title = p.title
    if (title.length > 20 && title.length < 200) points.push(title)
  })
  return points.slice(0, 4)
}

function SentimentBar({ score }: { score: number }) {
  const pct = ((score + 100) / 200) * 100
  const color = score > 20 ? '#1D9E75' : score < -20 ? '#E24B4A' : '#F5A623'
  const label = score > 20 ? 'Bullish' : score < -20 ? 'Bearish' : 'Neutral'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: '#6b6b63' }}>Bearish</span>
        <span style={{ fontSize: '12px', fontWeight: 600, color }}>{label} ({score > 0 ? '+' : ''}{score})</span>
        <span style={{ fontSize: '12px', color: '#6b6b63' }}>Bullish</span>
      </div>
      <div style={{ height: '8px', background: '#e8e6e0', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color, borderRadius: '99px',
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  )
}

function GaugeMeter({ score }: { score: number }) {
  const angle = (score + 100) / 200 * 180 - 90
  const color = score > 20 ? '#1D9E75' : score < -20 ? '#E24B4A' : '#F5A623'
  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 120 70" width="120" height="70">
        <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="#E24B4A" strokeWidth="8" strokeLinecap="round" />
        <path d="M10,60 A50,50 0 0,1 60,10" fill="none" stroke="#F5A623" strokeWidth="8" />
        <path d="M60,10 A50,50 0 0,1 110,60" fill="none" stroke="#1D9E75" strokeWidth="8" strokeLinecap="round" />
        <g transform={`rotate(${angle}, 60, 60)`}>
          <line x1="60" y1="60" x2="60" y2="18" stroke="#1a1a18" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="60" cy="60" r="4" fill="#1a1a18" />
        </g>
      </svg>
      <p style={{ fontSize: '11px', fontWeight: 600, color, marginTop: '-8px' }}>
        {score > 20 ? '▲ Bullish' : score < -20 ? '▼ Bearish' : '◆ Neutral'}
      </p>
    </div>
  )
}

export default function SentimentPage() {
  const [data, setData] = useState<AssetSentiment[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  async function fetchRedditData() {
    setLoading(true)
    const allPosts: Post[] = []

    await Promise.all(
      SUBREDDITS.map(async (sub) => {
        try {
          const res = await fetch(
            `https://www.reddit.com/r/${sub}/hot.json?limit=50`,
            { headers: { 'Accept': 'application/json' } }
          )
          const json = await res.json()
          const posts = json?.data?.children?.map((c: any) => ({
            title: c.data.title,
            score: c.data.score,
            url: `https://reddit.com${c.data.permalink}`,
            subreddit: sub,
            created: c.data.created_utc,
          })) ?? []
          allPosts.push(...posts)
        } catch {
          // silently fail per subreddit
        }
      })
    )

    const sentiments: AssetSentiment[] = ASSETS.map(asset => {
      const relevant = allPosts.filter(p =>
        asset.keywords.some(kw => p.title.toLowerCase().includes(kw.toLowerCase()))
      )

      let bullish = 0, bearish = 0, neutral = 0
      relevant.forEach(p => {
        const s = scoreSentiment(p.title)
        if (s === 'bullish') bullish++
        else if (s === 'bearish') bearish++
        else neutral++
      })

      const total = bullish + bearish + neutral || 1
      const score = Math.round(((bullish - bearish) / total) * 100)
      const keyPoints = extractKeyPoints(relevant, asset.label)

      return {
        label: asset.label,
        bullish, bearish, neutral,
        score,
        posts: relevant.slice(0, 6),
        keyPoints,
      }
    })

    setData(sentiments)
    setLastUpdated(new Date().toLocaleTimeString())
    setLoading(false)
  }

  useEffect(() => {
    fetchRedditData()
    const interval = setInterval(fetchRedditData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const selectedData = data.find(d => d.label === selected)

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
          Reddit · ForexFactory · Live
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15 }}>
            Public Sentiment
          </h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {lastUpdated && (
              <span style={{ fontSize: '12px', color: '#aaa9a0' }}>Updated {lastUpdated}</span>
            )}
            <button onClick={fetchRedditData} style={{
              background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '7px', padding: '7px 14px', fontSize: '12px',
              cursor: 'pointer', fontFamily: 'var(--sans)', color: '#444',
            }}>
              ↻ Refresh
            </button>
          </div>
        </div>
        <p style={{ color: '#6b6b63', fontSize: '14px', marginTop: '0.75rem', maxWidth: '520px', lineHeight: 1.7 }}>
          Real-time crowd sentiment scraped from Reddit — what traders are actually saying about each asset right now.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '5rem 0', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#aaa9a0', marginBottom: '1rem' }}>Scraping Reddit...</div>
          <div style={{
            width: '40px', height: '40px', border: '3px solid #f0efe9',
            borderTop: '3px solid #1D9E75', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* Sentiment grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '3rem',
          }}>
            {data.map(asset => (
              <div
                key={asset.label}
                onClick={() => setSelected(selected === asset.label ? null : asset.label)}
                style={{
                  background: selected === asset.label ? '#f0faf6' : '#f7f6f3',
                  border: `1px solid ${selected === asset.label ? '#1D9E75' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a18' }}>{asset.label}</p>
                  <span style={{ fontSize: '11px', color: '#aaa9a0' }}>{asset.bullish + asset.bearish + asset.neutral} posts</span>
                </div>
                <GaugeMeter score={asset.score} />
                <div style={{ marginTop: '0.75rem' }}>
                  <SentimentBar score={asset.score} />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '0.75rem', fontSize: '11px' }}>
                  <span style={{ color: '#1D9E75' }}>▲ {asset.bullish}</span>
                  <span style={{ color: '#aaa9a0' }}>◆ {asset.neutral}</span>
                  <span style={{ color: '#E24B4A' }}>▼ {asset.bearish}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selectedData && (
            <div style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '14px',
              padding: '2rem',
              marginBottom: '3rem',
            }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                {selectedData.label} — What Traders Are Saying
              </h2>

              {/* Key points */}
              {selectedData.keyPoints.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
                    Key Points from Reddit
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedData.keyPoints.map((point, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                        padding: '10px 14px', background: '#f7f6f3', borderRadius: '8px',
                      }}>
                        <span style={{ color: '#1D9E75', fontWeight: 700, marginTop: '1px' }}>→</span>
                        <span style={{ fontSize: '13px', color: '#333', lineHeight: 1.5 }}>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw posts */}
              {selectedData.posts.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
                    Top Posts
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedData.posts.map((post, i) => {
                      const sentiment = scoreSentiment(post.title)
                      const sentColor = sentiment === 'bullish' ? '#1D9E75' : sentiment === 'bearish' ? '#E24B4A' : '#aaa9a0'
                      return (
                        <a key={i} href={post.url} target="_blank" rel="noopener noreferrer" style={{
                          display: 'flex', gap: '12px', alignItems: 'flex-start',
                          padding: '10px 14px', borderRadius: '8px',
                          border: '1px solid rgba(0,0,0,0.06)', background: '#fafaf8',
                          textDecoration: 'none',
                        }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: sentColor, marginTop: '3px', whiteSpace: 'nowrap' }}>
                            {sentiment === 'bullish' ? '▲' : sentiment === 'bearish' ? '▼' : '◆'}
                          </span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '13px', color: '#1a1a18', lineHeight: 1.5, marginBottom: '3px' }}>{post.title}</p>
                            <p style={{ fontSize: '11px', color: '#aaa9a0' }}>r/{post.subreddit} · {post.score} upvotes</p>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedData.posts.length === 0 && (
                <p style={{ fontSize: '13px', color: '#aaa9a0', fontStyle: 'italic' }}>
                  No relevant posts found right now. Reddit may not be discussing {selectedData.label} heavily at this moment.
                </p>
              )}
            </div>
          )}

          {/* Bottom summary */}
          <div style={{
            background: '#f7f6f3',
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
          }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '1rem' }}>
              Overall Market Mood
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {[...data].sort((a, b) => b.score - a.score).map(asset => {
                const color = asset.score > 20 ? '#1D9E75' : asset.score < -20 ? '#E24B4A' : '#F5A623'
                return (
                  <div key={asset.label} style={{
                    padding: '5px 12px', borderRadius: '20px',
                    background: `${color}15`, border: `1px solid ${color}40`,
                    fontSize: '12px', fontWeight: 500, color,
                  }}>
                    {asset.label} {asset.score > 0 ? '+' : ''}{asset.score}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
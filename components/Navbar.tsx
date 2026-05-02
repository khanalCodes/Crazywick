'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/predictions', label: 'Predictions' },
  { href: '/sentiment', label: 'Sentiment' },
  { href: '/journal', label: 'Journal' },
  { href: '/setups', label: '🔒 Setups', locked: true },
]

const articleCategories = [
  { href: '/articles/category/spirituality', label: '🧘 Spirituality' },
  { href: '/articles/category/institutional-research', label: 'Institutional Research' },
  { href: '/articles/category/company-analysis', label: 'Company Analysis & Valuation' },
  { href: '/articles/category/fintech', label: 'Fintech & Innovation' },
  { href: '/articles/category/economy-politics', label: 'Economy & Politics' },
  { href: '/articles/category/book-notes', label: 'Book Notes' },
  { href: '/articles/category/fed-cpi', label: 'Fed & CPI Watch' },
  { href: '/articles/category/geopolitics', label: 'Geopolitics' },
  { href: '/articles/category/markets', label: 'Markets' },
]

export default function Navbar() {
  const path = usePathname()
  const router = useRouter()
  const [showArticlesMenu, setShowArticlesMenu] = useState(false)
  const [showLockedModal, setShowLockedModal] = useState(false)

  return (
    <>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '60px',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        position: 'sticky', top: 0,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <Link href="/" style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: '#1a1a18' }}>
          crazy<span style={{ color: '#1D9E75' }}>wick</span>
        </Link>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {mainLinks.map(({ href, label, locked }) => {
            if (label === 'Articles') {
              return (
                <div key={href} style={{ position: 'relative' }}
                  onMouseEnter={() => setShowArticlesMenu(true)}
                  onMouseLeave={() => setShowArticlesMenu(false)}
                >
                  <Link href={href} style={{
                    padding: '6px 14px', borderRadius: '6px', fontSize: '13px',
                    fontWeight: path.startsWith('/articles') ? 500 : 400,
                    color: path.startsWith('/articles') ? '#1a1a18' : '#6b6b63',
                    background: path.startsWith('/articles') ? 'rgba(0,0,0,0.06)' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    Articles ▾
                  </Link>
                  {showArticlesMenu && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0,
                      background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '10px', padding: '6px',
                      minWidth: '240px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                      zIndex: 200,
                    }}>
                      {articleCategories.map(cat => (
                        <Link key={cat.href} href={cat.href} style={{
                          display: 'block', padding: '8px 12px',
                          fontSize: '13px', color: '#444', borderRadius: '6px',
                          whiteSpace: 'nowrap',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f7f6f3')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            if (locked) {
              return (
                <button key={href} onClick={() => setShowLockedModal(true)} style={{
                  padding: '6px 14px', borderRadius: '6px', fontSize: '13px',
                  fontWeight: 400, color: '#aaa', background: 'transparent',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
                }}>
                  {label}
                </button>
              )
            }

            return (
              <Link key={href} href={href} style={{
                padding: '6px 14px', borderRadius: '6px', fontSize: '13px',
                fontWeight: path === href ? 500 : 400,
                color: path === href ? '#1a1a18' : '#6b6b63',
                background: path === href ? 'rgba(0,0,0,0.06)' : 'transparent',
              }}>
                {label}
              </Link>
            )
          })}
        </div>

        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75', boxShadow: '0 0 8px #1D9E75' }} />
      </nav>

      {/* Locked modal */}
      {showLockedModal && (
        <div onClick={() => setShowLockedModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: '16px', padding: '2.5rem',
            maxWidth: '380px', width: '90%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.75rem', color: '#1a1a18' }}>
              Setups — Coming Soon
            </h2>
            <p style={{ fontSize: '14px', color: '#6b6b63', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              A curated library of market setups and trading knowledge — built to teach and pass on. 
              This will be a premium section in the future.
            </p>
            <button onClick={() => setShowLockedModal(false)} style={{
              background: '#1D9E75', color: '#fff', border: 'none',
              padding: '10px 24px', borderRadius: '8px', fontSize: '13px',
              fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--sans)',
            }}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
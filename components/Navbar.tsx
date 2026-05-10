'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/predictions', label: 'Predictions' },
  { href: '/analysis', label: 'Analysis' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },       
  { href: '/setups', label: 'Setups', locked: true },
]

const articleCategories = [
  { href: '/articles/category/spirituality', label: 'Spirituality' },
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
  const [showArticlesMenu, setShowArticlesMenu] = useState(false)
  const [showLockedModal, setShowLockedModal] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <style>{`
        .nav-link {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          transition: background 0.15s, color 0.15s;
          display: inline-block;
        }
       .nav-link:hover {
  background: #f0faf6 !important;
  color: #1D9E75 !important;
}
        .dropdown-item {
          display: block;
          padding: 8px 12px;
          font-size: 13px;
          color: #444;
          border-radius: 6px;
          transition: background 0.12s, color 0.12s;
        }
       .dropdown-item:hover {
  background: #f0faf6;
  color: #1D9E75;
}
        .mobile-link {
          display: block;
          padding: 12px 0;
          font-size: 15px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          transition: color 0.15s;
        }
        .mobile-link:hover {
          color: #1D9E75 !important;
        }
        .mobile-cat-link {
          display: block;
          padding: 9px 0;
          font-size: 13px;
          color: #6b6b63;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          transition: color 0.15s;
        }
        .mobile-cat-link:hover {
          color: #1D9E75;
        }
      `}</style>

      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '60px',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        position: 'sticky', top: 0,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        {/* Logo */}
        <Link href="/" style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: '#1a1a18' }}>
          crazy<span style={{ color: '#1D9E75' }}>wick</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {mainLinks.map(({ href, label, locked }) => {
            if (label === 'Articles') {
              return (
                <div key={href} style={{ position: 'relative' }}
                  onMouseEnter={() => setShowArticlesMenu(true)}
                  onMouseLeave={() => setShowArticlesMenu(false)}
                >
                  <Link key={href} href={href} className={path === href ? 'nav-link nav-link-active' : 'nav-link'} style={{
  fontWeight: path === href ? 500 : 400,
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
                        <Link key={cat.href} href={cat.href} className="dropdown-item">
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
                  transition: 'color 0.15s',
                }}>
                  {label}
                </button>
              )
            }

            return (
              <Link key={href} href={href} className="nav-link" style={{
                fontWeight: path === href ? 500 : 400,
                color: path === href ? '#1a1a18' : '#6b6b63',
                background: path === href ? 'rgba(0,0,0,0.06)' : 'transparent',
              }}>
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75', boxShadow: '0 0 8px #1D9E75' }} />
          <button
            className="hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none', flexDirection: 'column', gap: '5px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
            }}
          >
            <span style={{ width: '22px', height: '2px', background: mobileOpen ? '#1D9E75' : '#1a1a18', display: 'block', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ width: '22px', height: '2px', background: '#1a1a18', display: 'block', opacity: mobileOpen ? 0 : 1, transition: 'all 0.2s' }} />
            <span style={{ width: '22px', height: '2px', background: mobileOpen ? '#1D9E75' : '#1a1a18', display: 'block', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0,
          background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)',
          zIndex: 99, padding: '1rem 1.5rem 1.5rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        }}>
          {mainLinks.map(({ href, label, locked }) => {
            if (locked) {
              return (
                <button key={href} onClick={() => { setShowLockedModal(true); setMobileOpen(false) }} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '12px 0', fontSize: '15px', color: '#aaa',
                  background: 'none', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)',
                  cursor: 'pointer', fontFamily: 'var(--sans)',
                }}>
                  {label}
                </button>
              )
            }
            return (
              <Link key={href} href={href} className="mobile-link" onClick={() => setMobileOpen(false)} style={{
                fontWeight: path === href ? 600 : 400,
                color: path === href ? '#1D9E75' : '#1a1a18',
              }}>
                {label}
              </Link>
            )
          })}

          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
              Article categories
            </p>
            {articleCategories.map(cat => (
              <Link key={cat.href} href={cat.href} className="mobile-cat-link" onClick={() => setMobileOpen(false)}>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      )}

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
              A curated library of market setups and trading knowledge — built to teach and pass on. This will be a premium section in the future.
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
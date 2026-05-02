import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      maxWidth: '500px', margin: '0 auto', padding: '8rem 2rem',
      textAlign: 'center',
    }}>
      <p style={{ fontFamily: 'var(--serif)', fontSize: '5rem', color: 'var(--text-dim)', lineHeight: 1 }}>404</p>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', margin: '1rem 0 0.75rem' }}>Page not found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '14px' }}>
        This page doesn't exist or the article was moved.
      </p>
      <Link href="/" style={{
        background: 'var(--green-dark)', color: '#d0f0e8',
        padding: '10px 22px', borderRadius: '7px', fontSize: '13px', fontWeight: 500,
      }}>
        ← Back to home
      </Link>
    </div>
  )
}

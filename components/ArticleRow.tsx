'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function ArticleRow({ slug, title, excerpt, date, readingTime, categoryName }: {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  categoryName: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/articles/${slug}`} style={{ display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '1.5rem 1rem',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
          alignItems: 'start',
          borderRadius: '8px',
          background: hovered ? '#f0faf6' : 'transparent',
          transition: 'background 0.15s',
        }}
      >
        <div>
          <div style={{
            fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.07em', textTransform: 'uppercase',
            color: '#1D9E75', marginBottom: '6px',
          }}>
            {categoryName}
          </div>
          <h2 style={{
            fontFamily: 'var(--serif)', fontSize: '1.2rem',
            lineHeight: 1.3, marginBottom: '0.4rem',
            color: hovered ? '#1D9E75' : '#1a1a18',
            transition: 'color 0.15s',
          }}>
            {title}
          </h2>
          <p style={{ fontSize: '13px', color: '#6b6b63', lineHeight: 1.6 }}>
            {excerpt}
          </p>
        </div>
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <p style={{ fontSize: '12px', color: '#aaa9a0' }}>{date}</p>
          <p style={{ fontSize: '11px', color: '#aaa9a0', marginTop: '4px' }}>{readingTime}</p>
          <p style={{ fontSize: '11px', color: '#1D9E75', marginTop: '6px', fontWeight: 500 }}>
            {hovered ? 'Read →' : '→'}
          </p>
        </div>
      </div>
    </Link>
  )
}
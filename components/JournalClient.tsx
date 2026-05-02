'use client'

import { useState } from 'react'

type Entry = {
  slug: string
  date: string
  market: string
  asset: string
  direction: 'long' | 'short'
  entry?: string
  exit?: string
  content: string
  images?: string[]
}

export default function JournalClient({ entries }: { entries: Entry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {entries.map((entry) => (
        <JournalBlock key={entry.slug} entry={entry} />
      ))}
    </div>
  )
}

function JournalBlock({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState(false)

  const color = entry.direction === 'long' ? '#1D9E75' : '#E24B4A'

  return (
    <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 20 }}>
      
      {/* DATE */}
      <div style={{ fontSize: 12, color: '#aaa9a0', marginBottom: 6 }}>
        {entry.date}
      </div>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div>
          <strong>{entry.asset}</strong>
          <span style={{
            marginLeft: 10,
            color,
            fontWeight: 600
          }}>
            {entry.direction.toUpperCase()}
          </span>
        </div>

        {/* BIGGER BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(0,0,0,0.1)',
            background: open ? '#1D9E75' : '#f7f6f3',
            color: open ? '#fff' : '#1a1a18',
            fontSize: 20,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          {open ? '−' : '+'}
        </button>
      </div>

      {/* ENTRY/EXIT */}
      {(entry.entry || entry.exit) && (
        <div style={{ fontSize: 13, marginTop: 6, color: '#6b6b63' }}>
          {entry.entry && `Entry: ${entry.entry}`}
          {entry.exit && ` → Exit: ${entry.exit}`}
        </div>
      )}

      {/* EXPANDED */}
      {open && (
        <div style={{
          marginTop: 15,
          padding: 15,
          background: '#f7f6f3',
          borderRadius: 8
        }}>
          
          {/* TEXT */}
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
            <MarkdownRenderer content={entry.content} />
          </div>

          {/* IMAGES */}
          {entry.images && entry.images.length > 0 && (
            <div style={{
              marginTop: 15,
              display: 'flex',
              gap: 10,
              overflowX: 'auto'
            }}>
              {entry.images.slice(0, 3).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="journal"
                  style={{
                    width: 200,
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '1px solid rgba(0,0,0,0.08)'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: content
          .replace(/### (.*?)/g, '<h3 style="margin-top:10px;">$1</h3>')
          .replace(/\n/g, '<br/>')
      }}
    />
  )
}
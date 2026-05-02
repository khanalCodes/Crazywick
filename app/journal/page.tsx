// app/journal/page.tsx

import { getJournalEntries } from '@/lib/journal'
import JournalClient from '@/components/JournalClient'

export default function JournalPage() {
  const entries = getJournalEntries()

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 34, marginBottom: 10 }}>Trade Journal</h1>
      <p style={{ color: '#6b6b63', marginBottom: 40 }}>
        Raw record of trades, decisions, mistakes, and lessons.
      </p>

      <JournalClient entries={entries} />
    </main>
  )
}
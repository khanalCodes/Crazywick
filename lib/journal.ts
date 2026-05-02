// lib/journal.ts

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const journalDirectory = path.join(process.cwd(), 'content/journal')

export type JournalEntry = {
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

export function getJournalEntries(): JournalEntry[] {
  const files = fs.readdirSync(journalDirectory)

  return files.map((file) => {
    const slug = file.replace('.mdx', '')
    const fullPath = path.join(journalDirectory, file)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      date: data.date,
      market: data.market,
      asset: data.asset,
      direction: data.direction,
      entry: data.entry,
      exit: data.exit,
      content,
      images: data.images || []
    }
  }).sort((a, b) => (a.date < b.date ? 1 : -1))
}
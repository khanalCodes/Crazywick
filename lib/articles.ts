import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')
const PREDICTIONS_DIR = path.join(process.cwd(), 'content/predictions')

export type Article = {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  readingTime: string
  content: string
}

export type Prediction = {
  slug: string
  title: string
  date: string
  asset: string
  direction: 'bullish' | 'bearish' | 'neutral'
  target: string
  timeframe: string
  status: 'open' | 'correct' | 'incorrect'
  excerpt: string
  content: string
}

function readDir(dir: string) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
}

export function getAllArticles(): Article[] {
  return readDir(ARTICLES_DIR)
    .map(filename => {
      const slug = filename.replace(/\.(mdx|md)$/, '')
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title ?? 'Untitled',
        date: data.date ?? '',
        excerpt: data.excerpt ?? '',
        category: data.category ?? 'Analysis',
        readingTime: readingTime(content).text,
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticleBySlug(slug: string): Article | null {
  const files = readDir(ARTICLES_DIR)
  const match = files.find(f => f.startsWith(slug))
  if (!match) return null
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, match), 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title ?? 'Untitled',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    category: data.category ?? 'Analysis',
    readingTime: readingTime(content).text,
    content,
  }
}

export function getAllPredictions(): Prediction[] {
  return readDir(PREDICTIONS_DIR)
    .map(filename => {
      const slug = filename.replace(/\.(mdx|md)$/, '')
      const raw = fs.readFileSync(path.join(PREDICTIONS_DIR, filename), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title ?? 'Untitled',
        date: data.date ?? '',
        asset: data.asset ?? '',
        direction: data.direction ?? 'neutral',
        target: data.target ?? '',
        timeframe: data.timeframe ?? '',
        status: data.status ?? 'open',
        excerpt: data.excerpt ?? '',
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

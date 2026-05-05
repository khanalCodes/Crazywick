import { MetadataRoute } from 'next'
import { getAllArticles, getAllPredictions } from '@/lib/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const predictions = getAllPredictions()

  const articleUrls = articles.map(a => ({
    url: `https://crazywick.com/articles/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const predictionUrls = predictions.map(p => ({
    url: `https://crazywick.com/predictions/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const categoryUrls = [
    'spirituality', 'institutional-research', 'company-analysis',
    'fintech', 'economy-politics', 'book-notes',
    'fed-cpi', 'geopolitics', 'markets',
  ].map(cat => ({
    url: `https://crazywick.com/articles/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: 'https://crazywick.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://crazywick.com/articles',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://crazywick.com/predictions',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://crazywick.com/analysis',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://crazywick.com/journal',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...categoryUrls,
    ...articleUrls,
    ...predictionUrls,
  ]
}
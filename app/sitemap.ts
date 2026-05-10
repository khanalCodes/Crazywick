import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, predictions, analyses] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: { slug: true, updatedAt: true },
    }),
    prisma.prediction.findMany({
      where: { deletedAt: null },
      select: { id: true, updatedAt: true },
    }),
    prisma.analysis.findMany({
      where: { isPublic: true, deletedAt: null },
      select: { id: true, updatedAt: true },
    }),
  ])

  const articleUrls = articles.map((a: { slug: string; updatedAt: Date }) => ({
    url: `https://crazywick.com/articles/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const predictionUrls = predictions.map((p: { id: string; updatedAt: Date }) => ({
    url: `https://crazywick.com/predictions/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const analysisUrls = analyses.map((a: { id: string; updatedAt: Date }) => ({
    url: `https://crazywick.com/analysis/${a.id}`,
    lastModified: a.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    { url: 'https://crazywick.com',             lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: 'https://crazywick.com/articles',    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: 'https://crazywick.com/predictions', lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://crazywick.com/analysis',    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: 'https://crazywick.com/journal',     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://crazywick.com/about',       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...articleUrls,
    ...predictionUrls,
    ...analysisUrls,
  ]
}
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

type ArticleRaw = Awaited<ReturnType<typeof prisma.article.findMany>>[number]
type PredictionRaw = Awaited<ReturnType<typeof prisma.prediction.findMany>>[number]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    select: { slug: true, updatedAt: true },
  })

  const predictions = await prisma.prediction.findMany({
    where: { deletedAt: null },
    select: { id: true, updatedAt: true },
  })

  const articleUrls = articles.map((a: ArticleRaw) => ({
    url: `https://crazywick.com/articles/${a.slug}`,
    lastModified: a.updatedAt,
  }))

  const predictionUrls = predictions.map((p: PredictionRaw) => ({
    url: `https://crazywick.com/predictions/${p.id}`,
    lastModified: p.updatedAt,
  }))

  return [
    { url: 'https://crazywick.com', lastModified: new Date() },
    { url: 'https://crazywick.com/articles', lastModified: new Date() },
    { url: 'https://crazywick.com/predictions', lastModified: new Date() },
    { url: 'https://crazywick.com/analysis', lastModified: new Date() },
    { url: 'https://crazywick.com/journal', lastModified: new Date() },
    ...articleUrls,
    ...predictionUrls,
  ]
}
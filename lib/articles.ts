import { prisma } from "@/lib/prisma"

export type Article = {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  readingTime: string
  author: string
  content: string
}

export type Prediction = {
  id: string
  title: string
  type: string
  asset: string
  direction: string
  probability: number | null
  target: string | null
  timeframe: string
  status: string
  thesis: string
  confidenceNote: string | null
  outcomeNote: string | null
  voteCount: number
  agreeCount: number
  disagreeCount: number
  viewCount: number
  publishedAt: string
  resolvedAt: string | null
  author: string
  articleSlug: string | null
}

type ArticleWithRelations = Awaited<ReturnType<typeof prisma.article.findMany>> [number] & {
  author: { name: string | null }
  category: { name: string }
}

type PredictionWithRelations = Awaited<ReturnType<typeof prisma.prediction.findMany>>[number] & {
  author: { name: string | null }
  article: { slug: string } | null
}

export async function getAllArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { publishedAt: "desc" },
    include: { author: true, category: true },
  })

  return articles.map((a: ArticleWithRelations) => ({
    slug: a.slug,
    title: a.title,
    date: a.publishedAt?.toISOString() ?? a.createdAt.toISOString(),
    excerpt: a.excerpt ?? "",
    category: a.category?.name ?? "Uncategorized",
    author: a.author?.name ?? "CrazyWick",
    readingTime: `${Math.ceil(a.content.length / 1000)} min read`,
    content: a.content,
  }))
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const a = await prisma.article.findUnique({
    where: { slug },
    include: { author: true, category: true },
  })

  if (!a) return null

  return {
    slug: a.slug,
    title: a.title,
    date: a.publishedAt?.toISOString() ?? a.createdAt.toISOString(),
    excerpt: a.excerpt ?? "",
    category: a.category?.name ?? "Uncategorized",
    author: a.author?.name ?? "CrazyWick",
    readingTime: `${Math.ceil(a.content.length / 1000)} min read`,
    content: a.content,
  }
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      category: { slug: categorySlug },
    },
    orderBy: { publishedAt: "desc" },
    include: { author: true, category: true },
  })

  return articles.map((a: ArticleWithRelations) => ({
    slug: a.slug,
    title: a.title,
    date: a.publishedAt?.toISOString() ?? a.createdAt.toISOString(),
    excerpt: a.excerpt ?? "",
    category: a.category?.name ?? "Uncategorized",
    author: a.author?.name ?? "CrazyWick",
    readingTime: `${Math.ceil(a.content.length / 1000)} min read`,
    content: a.content,
  }))
}

export async function getAllPredictions(): Promise<Prediction[]> {
  const predictions = await prisma.prediction.findMany({
    where: { deletedAt: null },
    orderBy: { publishedAt: "desc" },
    include: { author: true, article: true },
  })

  return predictions.map((p: PredictionWithRelations) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    asset: p.asset,
    direction: p.direction,
    probability: p.probability,
    target: p.target,
    timeframe: p.timeframe,
    status: p.status,
    thesis: p.thesis,
    confidenceNote: p.confidenceNote,
    outcomeNote: p.outcomeNote,
    voteCount: p.voteCount,
    agreeCount: p.agreeCount,
    disagreeCount: p.disagreeCount,
    viewCount: p.viewCount,
    publishedAt: p.publishedAt.toISOString(),
    resolvedAt: p.resolvedAt?.toISOString() ?? null,
    author: p.author?.name ?? "CrazyWick",
    articleSlug: p.article?.slug ?? null,
  }))
}
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

export async function getAllArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { publishedAt: "desc" },
    include: { author: true, category: true },
  })

  return articles.map(a => ({
    slug: a.slug,
    title: a.title,
    date: a.publishedAt?.toISOString() ?? a.createdAt.toISOString(),
    excerpt: a.excerpt ?? "",
    category: a.category.name,
    author: a.author.name ?? "CrazyWick",
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
    category: a.category.name,
    author: a.author.name ?? "CrazyWick",
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

  return articles.map(a => ({
    slug: a.slug,
    title: a.title,
    date: a.publishedAt?.toISOString() ?? a.createdAt.toISOString(),
    excerpt: a.excerpt ?? "",
    category: a.category.name,
    author: a.author.name ?? "CrazyWick",
    readingTime: `${Math.ceil(a.content.length / 1000)} min read`,
    content: a.content,
  }))
}
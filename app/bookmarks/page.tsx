import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ArticleRow from "@/components/ArticleRow"
import type { Article } from "@/lib/articles"

export const metadata = { title: "Bookmarks — CrazyWick" }

type BookmarkWithArticle = Awaited<ReturnType<typeof prisma.bookmark.findMany>>[number] & {
  article: {
    slug: string
    title: string
    publishedAt: Date | null
    createdAt: Date
    excerpt: string | null
    content: string
    author: { name: string | null }
    category: { name: string }
  }
}

export default async function BookmarksPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      article: {
        include: {
          author: { select: { name: true } },
          category: { select: { name: true } },
        },
      },
    },
  })

  const articles: Article[] = bookmarks.map((b: BookmarkWithArticle) => ({
    slug: b.article.slug,
    title: b.article.title,
    date: b.article.publishedAt?.toISOString() ?? b.article.createdAt.toISOString(),
    excerpt: b.article.excerpt ?? "",
    category: b.article.category.name,
    author: b.article.author.name ?? "CrazyWick",
    readingTime: `${Math.ceil(b.article.content.length / 1000)} min read`,
    content: b.article.content,
  }))

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
        Bookmarks
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 40, fontFamily: "DM Sans, sans-serif" }}>
        {articles.length} saved article{articles.length !== 1 ? "s" : ""}
      </p>

      {articles.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginTop: 80 }}>Nothing saved yet. Bookmark articles to find them here.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {articles.map((a) => <ArticleRow key={a.slug} article={a} />)}
        </div>
      )}
    </main>
  )
}

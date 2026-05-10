import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })

  const { articleId } = await req.json()
  if (!articleId) return NextResponse.json({ error: "Missing articleId" }, { status: 400 })

  const userId = session.user.id

  const existing = await prisma.bookmark.findUnique({
    where: { userId_articleId: { userId, articleId } },
  })

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } })
    await prisma.article.update({ where: { id: articleId }, data: { bookmarkCount: { decrement: 1 } } })
    return NextResponse.json({ bookmarked: false })
  }

  await prisma.bookmark.create({ data: { userId, articleId } })
  await prisma.article.update({ where: { id: articleId }, data: { bookmarkCount: { increment: 1 } } })
  return NextResponse.json({ bookmarked: true })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ bookmarked: false })

  const { searchParams } = new URL(req.url)
  const articleId = searchParams.get("articleId")
  if (!articleId) return NextResponse.json({ error: "Missing articleId" }, { status: 400 })

  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_articleId: { userId: session.user.id, articleId } },
  })

  return NextResponse.json({ bookmarked: !!bookmark })
}

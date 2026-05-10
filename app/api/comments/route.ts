import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const articleId = searchParams.get("articleId")
  if (!articleId) return NextResponse.json({ error: "Missing articleId" }, { status: 400 })

  const comments = await prisma.comment.findMany({
    where: { articleId, parentId: null, deletedAt: null, status: "VISIBLE" },
    orderBy: [{ isPinned: "desc" }, { createdAt: "asc" }],
    include: {
      author: { select: { id: true, name: true, image: true, username: true } },
      replies: {
        where: { deletedAt: null, status: "VISIBLE" },
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, image: true, username: true } },
        },
      },
    },
  })

  return NextResponse.json({ comments })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
  }

  const { articleId, content, parentId } = await req.json()
  if (!articleId || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: {
      authorId: session.user.id,
      articleId,
      content: content.trim(),
      parentId: parentId ?? null,
    },
    include: {
      author: { select: { id: true, name: true, image: true, username: true } },
    },
  })

  await prisma.article.update({
    where: { id: articleId },
    data: { commentCount: { increment: 1 } },
  })

  return NextResponse.json({ comment })
}

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })

  const { id } = await params
  const comment = await prisma.comment.findUnique({ where: { id } })

  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const isOwner = comment.authorId === session.user.id
  const isAdmin = (session.user as { role?: string }).role === "ADMIN"

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.comment.update({
    where: { id },
    data: { deletedAt: new Date(), status: "DELETED" },
  })

  await prisma.article.update({
    where: { id: comment.articleId },
    data: { commentCount: { decrement: 1 } },
  })

  return NextResponse.json({ success: true })
}

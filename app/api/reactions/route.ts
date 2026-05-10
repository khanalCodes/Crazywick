import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"
import { ReactionType, Prisma } from "@prisma/client"

function getClientId(req: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  return `ip:${ip}`
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const { type, articleId, predictionId, analysisId } = await req.json()

  if (!type || (!articleId && !predictionId && !analysisId)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  if (!Object.values(ReactionType).includes(type)) {
    return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 })
  }

  const targetKey = articleId
    ? `article:${articleId}`
    : predictionId
    ? `prediction:${predictionId}`
    : `analysis:${analysisId}`

  if (session?.user?.id) {
    const userId = session.user.id

    const uniqueWhere: Prisma.ReactionWhereUniqueInput = articleId
      ? { userId_type_articleId: { userId, type, articleId } }
      : predictionId
      ? { userId_type_predictionId: { userId, type, predictionId } }
      : { userId_type_commentId: { userId, type, commentId: analysisId } }

    const existing = await prisma.reaction.findUnique({ where: uniqueWhere })

    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } })
      if (articleId) await prisma.article.update({ where: { id: articleId }, data: { likeCount: { decrement: 1 } } })
      return NextResponse.json({ reacted: false, type })
    }

    // Remove any other reaction type on same target (one reaction at a time)
    const otherWhere = articleId ? { articleId } : predictionId ? { predictionId } : { commentId: analysisId }
    await prisma.reaction.deleteMany({ where: { userId, ...otherWhere } })

    await prisma.reaction.create({
      data: {
        userId,
        type,
        ...(articleId ? { articleId } : predictionId ? { predictionId } : { commentId: analysisId }),
      },
    })
    if (articleId) await prisma.article.update({ where: { id: articleId }, data: { likeCount: { increment: 1 } } })
    return NextResponse.json({ reacted: true, type })
  }

  const clientId = getClientId(req)
  const existingAnon = await prisma.analyticsEvent.findFirst({
    where: { type: "REACTION", sessionId: clientId, targetType: type, targetId: targetKey },
  })

  if (existingAnon) {
    await prisma.analyticsEvent.delete({ where: { id: existingAnon.id } })
    if (articleId) await prisma.article.update({ where: { id: articleId }, data: { likeCount: { decrement: 1 } } })
    return NextResponse.json({ reacted: false, type })
  }

  // Remove other anon reactions on same target
  await prisma.analyticsEvent.deleteMany({
    where: { type: "REACTION", sessionId: clientId, targetId: targetKey },
  })

  await prisma.analyticsEvent.create({
    data: { type: "REACTION", sessionId: clientId, targetType: type, targetId: targetKey },
  })
  if (articleId) await prisma.article.update({ where: { id: articleId }, data: { likeCount: { increment: 1 } } })
  return NextResponse.json({ reacted: true, type })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  const { searchParams } = new URL(req.url)
  const articleId    = searchParams.get("articleId")
  const predictionId = searchParams.get("predictionId")
  const analysisId   = searchParams.get("analysisId")

  if (!articleId && !predictionId && !analysisId) {
    return NextResponse.json({ error: "Missing target" }, { status: 400 })
  }

  const where = articleId
    ? { articleId }
    : predictionId
    ? { predictionId: predictionId! }
    : { commentId: analysisId! }

  const targetKey = articleId
    ? `article:${articleId}`
    : predictionId
    ? `prediction:${predictionId}`
    : `analysis:${analysisId}`

  const reactions = await prisma.reaction.groupBy({
    by: ["type"],
    where,
    _count: { type: true },
  })
  const counts: Record<string, number> = {}
  for (const r of reactions as Array<{ type: ReactionType; _count: { type: number } }>) {
    counts[r.type] = r._count.type
  }

  const anonReactions = await prisma.analyticsEvent.groupBy({
    by: ["targetType"],
    where: { type: "REACTION", targetId: targetKey },
    _count: { targetType: true },
  })
  for (const r of anonReactions as Array<{ targetType: string | null; _count: { targetType: number } }>) {
    if (r.targetType) counts[r.targetType] = (counts[r.targetType] ?? 0) + r._count.targetType
  }

  let userReactions: string[] = []
  if (session?.user?.id) {
    const mine = await prisma.reaction.findMany({
      where: { ...where, userId: session.user.id },
      select: { type: true },
    })
    userReactions = mine.map((r: { type: ReactionType }) => r.type)
  } else {
    const clientId = getClientId(req)
    const anonMine = await prisma.analyticsEvent.findMany({
      where: { type: "REACTION", sessionId: clientId, targetId: targetKey },
      select: { targetType: true },
    })
    userReactions = anonMine
      .map((r: { targetType: string | null }) => r.targetType ?? "")
      .filter(Boolean)
  }

  return NextResponse.json({ counts, userReactions })
}
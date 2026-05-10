import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

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
  const { predictionId, agrees } = await req.json()

  if (!predictionId || typeof agrees !== "boolean") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  if (session?.user?.id) {
    // Logged-in: use PredictionVote table
    const userId   = session.user.id
    const existing = await prisma.predictionVote.findUnique({
      where: { predictionId_userId: { predictionId, userId } },
    })

    if (existing) {
      if (existing.agrees === agrees) {
        // Remove vote
        await prisma.predictionVote.delete({ where: { id: existing.id } })
        await prisma.prediction.update({
          where: { id: predictionId },
          data: {
            voteCount: { decrement: 1 },
            ...(agrees ? { agreeCount: { decrement: 1 } } : { disagreeCount: { decrement: 1 } }),
          },
        })
        return NextResponse.json({ voted: false })
      }
      // Switch vote
      await prisma.predictionVote.update({ where: { id: existing.id }, data: { agrees } })
      await prisma.prediction.update({
        where: { id: predictionId },
        data: agrees
          ? { agreeCount: { increment: 1 }, disagreeCount: { decrement: 1 } }
          : { disagreeCount: { increment: 1 }, agreeCount: { decrement: 1 } },
      })
      return NextResponse.json({ voted: true, agrees })
    }

    await prisma.predictionVote.create({ data: { predictionId, userId, agrees } })
    await prisma.prediction.update({
      where: { id: predictionId },
      data: {
        voteCount: { increment: 1 },
        ...(agrees ? { agreeCount: { increment: 1 } } : { disagreeCount: { increment: 1 } }),
      },
    })
    return NextResponse.json({ voted: true, agrees })
  }

  // Anonymous: use AnalyticsEvent keyed by IP
  const clientId  = getClientId(req)
  const targetKey = `prediction:${predictionId}`
  const agreeKey  = agrees ? "VOTE_AGREE" : "VOTE_DISAGREE"
  const otherKey  = agrees ? "VOTE_DISAGREE" : "VOTE_AGREE"

  const existing = await prisma.analyticsEvent.findFirst({
    where: { sessionId: clientId, targetId: targetKey, type: { in: ["VOTE_AGREE", "VOTE_DISAGREE"] } },
  })

  if (existing) {
    if (existing.type === agreeKey) {
      // Remove vote
      await prisma.analyticsEvent.delete({ where: { id: existing.id } })
      await prisma.prediction.update({
        where: { id: predictionId },
        data: {
          voteCount: { decrement: 1 },
          ...(agrees ? { agreeCount: { decrement: 1 } } : { disagreeCount: { decrement: 1 } }),
        },
      })
      return NextResponse.json({ voted: false })
    }
    // Switch vote
    await prisma.analyticsEvent.update({ where: { id: existing.id }, data: { type: agreeKey } })
    await prisma.prediction.update({
      where: { id: predictionId },
      data: agrees
        ? { agreeCount: { increment: 1 }, disagreeCount: { decrement: 1 } }
        : { disagreeCount: { increment: 1 }, agreeCount: { decrement: 1 } },
    })
    return NextResponse.json({ voted: true, agrees })
  }

  await prisma.analyticsEvent.create({
    data: { type: agreeKey, sessionId: clientId, targetId: targetKey, targetType: otherKey },
  })
  await prisma.prediction.update({
    where: { id: predictionId },
    data: {
      voteCount: { increment: 1 },
      ...(agrees ? { agreeCount: { increment: 1 } } : { disagreeCount: { increment: 1 } }),
    },
  })
  return NextResponse.json({ voted: true, agrees })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  const { searchParams } = new URL(req.url)
  const predictionId = searchParams.get("predictionId")
  if (!predictionId) return NextResponse.json({ error: "Missing predictionId" }, { status: 400 })

  const prediction = await prisma.prediction.findUnique({
    where: { id: predictionId },
    select: { voteCount: true, agreeCount: true, disagreeCount: true },
  })

  let userVote: boolean | null = null

  if (session?.user?.id) {
    const vote = await prisma.predictionVote.findUnique({
      where: { predictionId_userId: { predictionId, userId: session.user.id } },
    })
    if (vote) userVote = vote.agrees
  } else {
    const clientId = getClientId(req)
    const anonVote = await prisma.analyticsEvent.findFirst({
      where: { sessionId: clientId, targetId: `prediction:${predictionId}`, type: { in: ["VOTE_AGREE", "VOTE_DISAGREE"] } },
    })
    if (anonVote) userVote = anonVote.type === "VOTE_AGREE"
  }

  return NextResponse.json({ ...prediction, userVote })
}

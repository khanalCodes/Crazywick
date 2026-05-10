import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })

  const { followingId } = await req.json()
  if (!followingId) return NextResponse.json({ error: "Missing followingId" }, { status: 400 })

  const followerId = session.user.id
  if (followerId === followingId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  })

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
    return NextResponse.json({ following: false })
  }

  await prisma.follow.create({ data: { followerId, followingId } })
  return NextResponse.json({ following: true })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ following: false })

  const { searchParams } = new URL(req.url)
  const followingId = searchParams.get("followingId")
  if (!followingId) return NextResponse.json({ error: "Missing followingId" }, { status: 400 })

  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: session.user.id, followingId } },
  })

  return NextResponse.json({ following: !!follow })
}

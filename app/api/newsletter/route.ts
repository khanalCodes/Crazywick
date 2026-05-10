import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const session = await auth()

  const existing = await prisma.newsletter.findUnique({ where: { email } })
  if (existing) {
    if (!existing.isActive) {
      await prisma.newsletter.update({ where: { email }, data: { isActive: true, unsubscribedAt: null } })
      return NextResponse.json({ success: true, resubscribed: true })
    }
    return NextResponse.json({ success: true, alreadySubscribed: true })
  }

  await prisma.newsletter.create({
    data: {
      email,
      name: name ?? null,
      userId: session?.user?.id ?? null,
      source: "website",
    },
  })

  return NextResponse.json({ success: true })
}

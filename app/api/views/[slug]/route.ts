import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { viewCount: true },
  })
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ views: article.viewCount })
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const article = await prisma.article.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    })
    return NextResponse.json({ views: article.viewCount })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

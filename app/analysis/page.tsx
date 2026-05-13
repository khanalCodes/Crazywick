import { prisma } from "@/lib/prisma"
import AnalysisClient from "@/components/AnalysisClient"

export const metadata = {
  title: "Analysis — CrazyWick",
  description: "Technical analysis, bias, key levels, and chart breakdowns.",
}

type RawAnalysis = Awaited<ReturnType<typeof prisma.analysis.findMany>>[number]

const toArray = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.map(String)
  if (typeof val === "string") return val.split(",").map((s: string) => s.trim()).filter(Boolean)
  return []
}

export default async function AnalysisPage() {
  const raw = await prisma.analysis.findMany({
    where: { deletedAt: null, isPublic: true },
    orderBy: { createdAt: "desc" },
  })

  const analyses = raw.map((a: RawAnalysis) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    supportLevels: toArray(a.supportLevels),
    resistanceLevels: toArray(a.resistanceLevels),
  }))

  return <AnalysisClient analyses={analyses} />
}
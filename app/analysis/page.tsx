import { prisma } from "@/lib/prisma"
import AnalysisClient from "@/components/AnalysisClient"

export const metadata = {
  title: "Analysis — CrazyWick",
  description: "Technical analysis, bias, key levels, and chart breakdowns.",
}

export default async function AnalysisPage() {
  const analyses = await prisma.analysis.findMany({
    where: { deletedAt: null, isPublic: true },
    orderBy: { createdAt: "desc" },
  })

  return <AnalysisClient analyses={analyses} />
}
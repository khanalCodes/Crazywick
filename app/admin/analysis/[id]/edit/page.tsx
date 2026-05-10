import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { updateAnalysis } from "../../actions"
import AnalysisForm from "@/components/AnalysisForm"

export default async function EditAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const a = await prisma.analysis.findUnique({ where: { id } })
  if (!a) notFound()

  const updateWithId = updateAnalysis.bind(null, id)

  return (
    <div style={{ maxWidth: 860 }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, color: "#1a1a18", marginBottom: 32 }}>
        Edit Analysis — {a.asset}
      </h1>
      <AnalysisForm
        action={updateWithId}
        initial={{
          asset: a.asset,
          symbol: a.symbol,
          bias: a.bias,
          thesis: a.thesis,
          watchFor: a.watchFor ?? "",
          imageUrl: a.imageUrl ?? "",
          supportLevels: Array.isArray(a.supportLevels) ? (a.supportLevels as string[]).join(", ") : "",
          resistanceLevels: Array.isArray(a.resistanceLevels) ? (a.resistanceLevels as string[]).join(", ") : "",
          keyLevels: a.keyLevels && Array.isArray(a.keyLevels) ? (a.keyLevels as string[]).join(", ") : "",
          isPublic: a.isPublic,
        }}
      />
    </div>
  )
}

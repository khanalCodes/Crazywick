import { createAnalysis } from "../actions"
import AnalysisForm from "@/components/AnalysisForm"

export default function NewAnalysisPage() {
  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, color: "#1a1a18", marginBottom: 4 }}>
          New Analysis
        </h1>
        <p style={{ fontSize: 13, color: "#6b6b63", fontFamily: "DM Sans, sans-serif" }}>
          Document your technical analysis, key levels, and directional bias.
        </p>
      </div>
      <AnalysisForm action={createAnalysis} />
    </div>
  )
}

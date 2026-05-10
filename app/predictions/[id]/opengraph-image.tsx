import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OgImage({ params }: { params: { id: string } }) {
  const p = await prisma.prediction.findUnique({ where: { id: params.id } })

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        background: "#f7f6f3",
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end", padding: "60px",
      }}>
        <div style={{ fontSize: 16, color: "#1D9E75", fontWeight: 600, marginBottom: 16 }}>
          CRAZYWICK — PREDICTION
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, color: "#1a1a18", lineHeight: 1.2, marginBottom: 20 }}>
          {p?.title ?? "Market Prediction"}
        </div>
        <div style={{ fontSize: 22, color: "#6b6b63" }}>
          {p?.asset} · {p?.timeframe} · {p?.status}
        </div>
      </div>
    ),
    size
  )
}
import { prisma } from "@/lib/prisma"

export const metadata = { title: "Newsletter — Admin — CrazyWick" }

type Sub = Awaited<ReturnType<typeof prisma.newsletter.findMany>>[number]

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  })

  const active = subscribers.filter((s: Sub) => s.isActive).length

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
        Newsletter
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 15, fontFamily: "DM Sans, sans-serif", marginBottom: 32 }}>
        {active} active subscriber{active !== 1 ? "s" : ""} · {subscribers.length} total
      </p>

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "DM Sans, sans-serif", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.02)" }}>
              {["Email", "Name", "Source", "Status", "Joined"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s: Sub) => (
              <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 16px", color: "var(--text-primary)" }}>{s.email}</td>
                <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{s.name ?? "—"}</td>
                <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{s.source ?? "—"}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: s.isActive ? "var(--green-light-bg)" : "#fef0f0", color: s.isActive ? "var(--green-accent)" : "var(--red)" }}>
                    {s.isActive ? "Active" : "Unsubscribed"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "var(--text-dim)" }}>
                  {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif" }}>No subscribers yet.</p>
        )}
      </div>
    </div>
  )
}

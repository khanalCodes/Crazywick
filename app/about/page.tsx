import ContactForm from "@/components/ContactForm"

export const metadata = {
  title: "About — CrazyWick",
  description: "CrazyWick is a global financial intelligence platform built from Kathmandu, Nepal. Independent analysis, documented predictions, no agenda.",
}

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 56 }}>
        <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 600, color: "var(--green-accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          About
        </span>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 44, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2, margin: "12px 0 20px" }}>
          CrazyWick
        </h1>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 19, color: "var(--text-muted)", lineHeight: 1.7 }}>
          A global financial intelligence platform built from Kathmandu, Nepal — outside the Western bubble, independent by design.
        </p>
      </div>

      {/* What is CrazyWick */}
      <section style={{ marginBottom: 52 }}>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
          What is CrazyWick?
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "DM Sans, sans-serif", fontSize: 16, color: "var(--text-primary)", lineHeight: 1.8 }}>
          <p>
            CrazyWick is a financial intelligence platform built from <strong>Kathmandu, Nepal</strong> — not Wall Street, not London, not Singapore. The perspective here is genuinely independent, outside the Western consensus that dominates most financial media.
          </p>
          <p>
            The mission is simple: <strong>document everything</strong>. Every prediction, every analysis, every thesis — timestamped and on record. No deleting wrong calls. No cherry-picking wins. The track record is the product.
          </p>
        </div>
      </section>

      {/* What's covered — 4 boxes */}
      <section style={{ marginBottom: 52 }}>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
          What's covered
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            {
              icon: "✍️",
              title: "Articles",
              body: "Long-form financial writing — company deep dives, macro breakdowns, book notes, Fed & CPI watch, fintech, and institutional research. Built to inform, not entertain.",
            },
            {
              icon: "🌍",
              title: "Geopolitics",
              body: "How power, conflict, and policy shape markets. Coverage spans sanctions, trade wars, energy flows, and the geopolitical forces most analysts ignore or underestimate.",
            },
            {
              icon: "🎯",
              title: "Predictions",
              body: "Documented market calls — timestamped, public, and never deleted. Every prediction stays on record whether it hits or misses. Accountability is the differentiator.",
            },
            {
              icon: "📊",
              title: "Financial Markets",
              body: "Stocks, crypto, forex, commodities — global coverage from an independent vantage point. Setups, analysis, and trade journals built for people who think for themselves.",
            },
          ].map((card) => (
            <div key={card.title} style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "22px 22px",
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{card.icon}</div>
              <h3 style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                {card.title}
              </h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Who's behind it */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
          Who's behind it
        </h2>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--green-light-bg)", border: "2px solid var(--green-light-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
            🇳🇵
          </div>
          <div>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 6 }}>
              A self-taught builder from Kathmandu
            </div>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
              No finance degree, no institutional backing — just conviction that independent thinking and honest documentation beat credentials. Learning in public, building in public, losing in public when wrong, and winning when right.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0 0 56px" }} />

      {/* Contact form */}
      <section>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 32, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
          Say hello 👋
        </h2>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 16, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 32 }}>
          Collaboration, feedback, disagreement, or just want to talk markets — all welcome. I read everything.
        </p>
        <ContactForm />
      </section>

    </main>
  )
}

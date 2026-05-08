export default function AdminPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "28px", color: "#1a1a18", marginBottom: "8px" }}>
        Dashboard
      </h1>
      <p style={{ color: "#6b6b63", fontSize: "14px", marginBottom: "40px" }}>
        What do you want to publish today?
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {[
          { title: "New Article", desc: "Write and publish an article", href: "/admin/articles/new", color: "#1D9E75" },
          { title: "New Prediction", desc: "Log a market or geopolitical call", href: "/admin/predictions/new", color: "#1D9E75" },
          { title: "New Journal Entry", desc: "Record a trade", href: "/admin/journal/new", color: "#1D9E75" },
          { title: "Seed Categories", desc: "Add all 9 categories to DB", href: "/admin/categories", color: "#F5A623" },
        ].map(card => (
          <a key={card.href} href={card.href} style={{ textDecoration: "none" }}>
            <div style={{
              backgroundColor: "#f7f6f3",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "12px",
              padding: "24px",
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                backgroundColor: card.color, marginBottom: "16px",
              }} />
              <div style={{ fontWeight: 600, color: "#1a1a18", fontSize: "15px", marginBottom: "6px" }}>
                {card.title}
              </div>
              <div style={{ color: "#6b6b63", fontSize: "13px" }}>
                {card.desc}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
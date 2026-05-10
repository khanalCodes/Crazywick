import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
        backgroundColor: "#f7f6f3",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <span style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1D9E75", fontSize: "18px" }}>
            CrazyWick Admin
          </span>
          <nav style={{ display: "flex", gap: "24px" }}>
            {[
              { label: "Articles",    href: "/admin/articles" },
              { label: "Predictions", href: "/admin/predictions" },
              { label: "Journal",     href: "/admin/journal" },
              { label: "Categories",  href: "/admin/categories" },
              { label: "Analysis",    href: "/admin/analysis" },
              { label: "Newsletter",  href: "/admin/newsletter" },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                color: "#6b6b63", textDecoration: "none",
                fontSize: "14px", fontWeight: 500,
              }}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "13px", color: "#aaa9a0" }}>{session.user.email}</span>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }) }}>
            <button type="submit" style={{
              fontSize: "13px", fontWeight: 500,
              color: "#E24B4A", background: "#fef2f2",
              border: "1px solid #fecaca", borderRadius: "6px",
              padding: "5px 12px", cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}>
              Logout
            </button>
          </form>
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        {children}
      </div>
    </div>
  )
}

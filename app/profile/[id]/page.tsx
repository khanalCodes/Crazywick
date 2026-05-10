import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getAllArticles } from "@/lib/articles"
import ArticleRow from "@/components/ArticleRow"
import FollowButton from "@/components/FollowButton"
import { auth } from "@/auth"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id }, select: { name: true, username: true } })
  if (!user) return { title: "Profile — CrazyWick" }
  return { title: `${user.name ?? user.username ?? "Profile"} — CrazyWick` }
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const user = await prisma.user.findUnique({
    where: { id, deletedAt: null },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      image: true,
      location: true,
      website: true,
      twitterHandle: true,
      credibilityScore: true,
      predictionAccuracy: true,
      totalPredictions: true,
      correctPredictions: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          follows: true,
          articles: true,
          predictions: true,
        },
      },
    },
  })

  if (!user) notFound()

  const allArticles = await getAllArticles()
  const userArticles = allArticles.filter((a) => a.author === user.name).slice(0, 10)

  const isOwnProfile = session?.user?.id === user.id

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px" }}>
      {/* Profile header */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap" }}>
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name ?? "Avatar"} width={80} height={80} style={{ borderRadius: "50%", flexShrink: 0 }} />
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--green-light-bg)", border: "2px solid var(--green-light-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "var(--green-accent)", fontFamily: "DM Sans, sans-serif", flexShrink: 0 }}>
            {(user.name ?? "U")[0].toUpperCase()}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 6 }}>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              {user.name ?? user.username ?? "Anonymous"}
            </h1>
            {!isOwnProfile && <FollowButton followingId={user.id} />}
          </div>

          {user.username && (
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>@{user.username}</p>
          )}

          {user.bio && (
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.6, marginBottom: 12, maxWidth: 560 }}>
              {user.bio}
            </p>
          )}

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif" }}>
            {user.location && <span>📍 {user.location}</span>}
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green-accent)", textDecoration: "none" }}>
                🔗 Website
              </a>
            )}
            {user.twitterHandle && (
              <a href={`https://twitter.com/${user.twitterHandle}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green-accent)", textDecoration: "none" }}>
                𝕏 @{user.twitterHandle}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
        {[
          { label: "Followers", value: user._count.followers },
          { label: "Following", value: user._count.follows },
          { label: "Articles", value: user._count.articles },
          { label: "Predictions", value: user._count.predictions },
          ...(user.totalPredictions > 0
            ? [{ label: "Accuracy", value: `${Math.round(user.predictionAccuracy)}%` }]
            : []),
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 20px", minWidth: 90, textAlign: "center" }}>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</div>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Articles */}
      {userArticles.length > 0 && (
        <section>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
            Published Articles
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {userArticles.map((a) => (
              <ArticleRow key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

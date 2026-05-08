import { prisma } from '@/lib/prisma'
import AnalysisClient from '@/components/AnalysisClient'

export const dynamic = 'force-dynamic'

export default async function AnalysisPage() {
  const analyses = await prisma.analysis.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
  })

  const serialized = analyses.map((a: any) => ({
    id: a.id,
    asset: a.asset,
    symbol: a.symbol,
    bias: a.bias,
    thesis: a.thesis,
    watchFor: a.watchFor ?? '',
    imageUrl: a.imageUrl ?? null,
    supportLevels: a.supportLevels as string[],
    resistanceLevels: a.resistanceLevels as string[],
    createdAt: a.createdAt.toISOString(),
  }))

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
          Technical analysis · My views
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '0.75rem' }}>
          Chart Analysis
        </h1>
        <p style={{ color: '#6b6b63', fontSize: '14px', lineHeight: 1.7, maxWidth: '500px' }}>
          My technical analysis on key assets — key levels, bias, and thesis.
        </p>
      </div>

      {analyses.length === 0 ? (
        <p style={{ color: '#aaa9a0', fontSize: '14px' }}>No analysis yet. Add one from the admin panel.</p>
      ) : (
        <AnalysisClient analyses={serialized} />
      )}
    </div>
  )
}
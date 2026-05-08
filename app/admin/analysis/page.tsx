import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminAnalysisPage() {
  const analyses = await prisma.analysis.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#1a1a18' }}>Analysis</h1>
        <Link href="/admin/analysis/new" style={{
          backgroundColor: '#1D9E75', color: '#fff', padding: '10px 20px',
          borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
        }}>
          + New Analysis
        </Link>
      </div>

      {analyses.length === 0 ? (
        <p style={{ color: '#6b6b63', fontSize: '14px' }}>No analysis yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {analyses.map((a: any) => (
            <div key={a.id} style={{
              backgroundColor: '#f7f6f3', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '10px', padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontWeight: 600, color: '#1a1a18', fontSize: '15px', marginBottom: '4px' }}>{a.asset}</div>
                <div style={{ color: '#6b6b63', fontSize: '13px' }}>{a.symbol} · {a.bias} · {new Date(a.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
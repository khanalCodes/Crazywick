import { prisma } from '@/lib/prisma'
import JournalClient from '@/components/JournalClient'

export const dynamic = 'force-dynamic'

type JournalRaw = Awaited<ReturnType<typeof prisma.journalEntry.findMany>>[number]

export default async function JournalPage() {
  const entries = await prisma.journalEntry.findMany({
    where: { deletedAt: null, visibility: 'PUBLIC' },
    orderBy: { openedAt: 'desc' },
  })

  const serialized = entries.map((e: JournalRaw) => ({
    id: e.id,
    asset: e.asset,
    market: e.market,
    direction: e.direction,
    result: e.result,
    entryPrice: Number(e.entryPrice),
    exitPrice: e.exitPrice ? Number(e.exitPrice) : null,
    stopLoss: e.stopLoss ? Number(e.stopLoss) : null,
    takeProfit: e.takeProfit ? Number(e.takeProfit) : null,
    pnl: e.pnl ? Number(e.pnl) : null,
    reasoning: e.reasoning,
    mistakes: e.mistakes,
    lessons: e.lessons,
    psychology: e.psychology,
    setup: e.setup,
    openedAt: e.openedAt.toISOString(),
    closedAt: e.closedAt ? e.closedAt.toISOString() : null,
  }))

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 34, marginBottom: 10 }}>Trade Journal</h1>
      <p style={{ color: '#6b6b63', marginBottom: 40 }}>
        Raw record of trades, decisions, mistakes, and lessons.
      </p>
      <JournalClient entries={serialized} />
    </main>
  )
}
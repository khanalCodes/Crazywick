import { prisma } from "@/lib/prisma"
type JournalEntryRaw = Awaited<ReturnType<typeof prisma.journalEntry.findMany>>[number] & {
  entryPrice: { toString(): string }
  exitPrice: { toString(): string } | null
  stopLoss: { toString(): string } | null
  takeProfit: { toString(): string } | null
  pnl: { toString(): string } | null
}
export type JournalEntry = {
  id: string
  asset: string
  market: string
  direction: string
  entryPrice: string
  exitPrice: string | null
  stopLoss: string | null
  takeProfit: string | null
  pnl: string | null
  result: string
  reasoning: string | null
  psychology: string | null
  mistakes: string | null
  lessons: string | null
  screenshot: string | null
  openedAt: string
  closedAt: string | null
  visibility: string
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const entries = await prisma.journalEntry.findMany({
    where: { deletedAt: null, visibility: "PUBLIC" },
    orderBy: { openedAt: "desc" },
  })

return entries.map((e: JournalEntryRaw) => ({
      id: e.id,
    asset: e.asset,
    market: e.market,
    direction: e.direction,
    entryPrice: e.entryPrice.toString(),
    exitPrice: e.exitPrice?.toString() ?? null,
    stopLoss: e.stopLoss?.toString() ?? null,
    takeProfit: e.takeProfit?.toString() ?? null,
    pnl: e.pnl?.toString() ?? null,
    result: e.result,
    reasoning: e.reasoning,
    psychology: e.psychology,
    mistakes: e.mistakes,
    lessons: e.lessons,
    screenshot: e.screenshot,
    openedAt: e.openedAt.toISOString(),
    closedAt: e.closedAt?.toISOString() ?? null,
    visibility: e.visibility,
  }))
}
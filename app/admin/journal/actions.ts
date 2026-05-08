"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createJournalEntry(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized")

  const asset = formData.get("asset") as string
  const market = formData.get("market") as string
  const direction = formData.get("direction") as string
  const entryPrice = formData.get("entryPrice") as string
  const exitPrice = formData.get("exitPrice") as string
  const stopLoss = formData.get("stopLoss") as string
  const takeProfit = formData.get("takeProfit") as string
  const result = formData.get("result") as string
  const reasoning = formData.get("reasoning") as string
  const mistakes = formData.get("mistakes") as string
  const lessons = formData.get("lessons") as string
  const psychology = formData.get("psychology") as string
  const setup = formData.get("setup") as string
  const visibility = formData.get("visibility") as string
  const openedAt = formData.get("openedAt") as string

  await prisma.journalEntry.create({
    data: {
      asset,
      market: market as any,
      direction: direction as any,
      entryPrice: parseFloat(entryPrice),
      exitPrice: exitPrice ? parseFloat(exitPrice) : null,
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      result: result as any,
      reasoning: reasoning || null,
      mistakes: mistakes || null,
      lessons: lessons || null,
      psychology: psychology || null,
      setup: setup || null,
      visibility: visibility as any,
      openedAt: new Date(openedAt),
      authorId: session.user.id,
    },
  })

  revalidatePath("/admin/journal")
  revalidatePath("/journal")
  redirect("/admin/journal")
}
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AnalysisBias } from "@prisma/client"

const parseJsonField = (raw: string | null) => {
  if (!raw?.trim()) return []
  try { return JSON.parse(raw) } catch { return raw.split(",").map((s: string) => s.trim()).filter(Boolean) }
}

export async function createAnalysis(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  await prisma.analysis.create({
    data: {
      authorId: session.user.id,
      asset: (formData.get("asset") as string).trim(),
      symbol: (formData.get("symbol") as string).trim().toUpperCase(),
      bias: formData.get("bias") as AnalysisBias,
      thesis: (formData.get("thesis") as string).trim(),
      watchFor: (formData.get("watchFor") as string)?.trim() || null,
      imageUrl: (formData.get("imageUrl") as string)?.trim() || null,
      supportLevels: parseJsonField(formData.get("supportLevels") as string),
      resistanceLevels: parseJsonField(formData.get("resistanceLevels") as string),
      keyLevels: parseJsonField(formData.get("keyLevels") as string),
      isPublic: formData.get("isPublic") === "true",
    },
  })

  redirect("/admin/analysis")
}

export async function updateAnalysis(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  await prisma.analysis.update({
    where: { id },
    data: {
      asset: (formData.get("asset") as string).trim(),
      symbol: (formData.get("symbol") as string).trim().toUpperCase(),
      bias: formData.get("bias") as AnalysisBias,
      thesis: (formData.get("thesis") as string).trim(),
      watchFor: (formData.get("watchFor") as string)?.trim() || null,
      imageUrl: (formData.get("imageUrl") as string)?.trim() || null,
      supportLevels: parseJsonField(formData.get("supportLevels") as string),
      resistanceLevels: parseJsonField(formData.get("resistanceLevels") as string),
      keyLevels: parseJsonField(formData.get("keyLevels") as string),
      isPublic: formData.get("isPublic") === "true",
    },
  })

  redirect("/admin/analysis")
}

export async function deleteAnalysis(id: string) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  await prisma.analysis.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  redirect("/admin/analysis")
}

"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

const CATEGORIES = [
  { name: "Spirituality",                    slug: "spirituality" },
  { name: "Institutional Research",          slug: "institutional-research" },
  { name: "Company Analysis & Valuation",    slug: "company-analysis-valuation" },
  { name: "Fintech & Innovation",            slug: "fintech-innovation" },
  { name: "Economy & Politics",              slug: "economy-politics" },
  { name: "Book Notes",                      slug: "book-notes" },
  { name: "Fed & CPI Watch",                 slug: "fed-cpi-watch" },
  { name: "Geopolitics",                     slug: "geopolitics" },
  { name: "Markets",                         slug: "markets" },
]

export async function seedCategories() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized")

  for (const [index, cat] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: index,
        isActive: true,
      },
    })
  }

  revalidatePath("/admin/categories")
}

export async function deleteCategory(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized")

  const id = formData.get("id") as string
  await prisma.category.delete({ where: { id } })
  revalidatePath("/admin/categories")
}
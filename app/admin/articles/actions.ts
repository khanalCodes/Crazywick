"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createArticle(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const categoryId = formData.get("categoryId") as string
  const status = formData.get("status") as string
  const coverImage = formData.get("coverImage") as string

  if (!title || !slug || !content || !categoryId) {
    throw new Error("Missing required fields")
  }

  // Upsert user so they exist in DB
  const user = await prisma.user.upsert({
    where: { email: session.user.email! },
    update: {},
    create: {
      email: session.user.email!,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
      role: "ADMIN",
    },
  })

  await prisma.article.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      categoryId,
      authorId: user.id,
      status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      coverImage: coverImage || null,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  })

  revalidatePath("/admin/articles")
  revalidatePath("/articles")
  redirect("/admin/articles")
}
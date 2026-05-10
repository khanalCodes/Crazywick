"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createArticle(formData: FormData) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== "ADMIN") throw new Error("Unauthorized")

  const title      = formData.get("title")      as string
  const slug       = formData.get("slug")       as string
  const excerpt    = formData.get("excerpt")    as string
  const content    = formData.get("content")    as string
  const categoryId = formData.get("categoryId") as string
  const status     = formData.get("status")     as string
  const coverImage = formData.get("coverImage") as string

  if (!title || !slug || !content || !categoryId) throw new Error("Missing required fields")

  const user = await prisma.user.upsert({
    where:  { email: session.user.email! },
    update: {},
    create: {
      email: session.user.email!,
      name:  session.user.name  ?? null,
      image: session.user.image ?? null,
      role:  "ADMIN",
    },
  })

  const isPublished = status === "PUBLISHED"

  await prisma.article.create({
    data: {
      title,
      slug,
      excerpt:    excerpt    || null,
      content,
      categoryId,
      authorId:   user.id,
      status:     isPublished ? "PUBLISHED" : "DRAFT",
      coverImage: coverImage || null,
      // FIX: only set publishedAt when publishing, never overwrite if already set
      publishedAt: isPublished ? new Date() : null,
    },
  })

  revalidatePath("/admin/articles")
  revalidatePath("/articles")
  redirect("/admin/articles")
}

export async function updateArticle(formData: FormData) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== "ADMIN") throw new Error("Unauthorized")

  const id         = formData.get("id")         as string
  const title      = formData.get("title")      as string
  const slug       = formData.get("slug")       as string
  const excerpt    = formData.get("excerpt")    as string
  const content    = formData.get("content")    as string
  const categoryId = formData.get("categoryId") as string
  const status     = formData.get("status")     as string
  const coverImage = formData.get("coverImage") as string

  const isPublished = status === "PUBLISHED"

  // FIX: if already published keep original publishedAt, don't reset it to now
  const existing = await prisma.article.findUnique({ where: { id }, select: { publishedAt: true, status: true } })
  const wasAlreadyPublished = existing?.status === "PUBLISHED" && existing?.publishedAt != null

  await prisma.article.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt:    excerpt    || null,
      content,
      categoryId,
      status:     isPublished ? "PUBLISHED" : "DRAFT",
      coverImage: coverImage || null,
      publishedAt: isPublished
        ? (wasAlreadyPublished ? existing!.publishedAt : new Date())
        : null,
    },
  })

  revalidatePath("/admin/articles")
  revalidatePath("/articles")
  revalidatePath(`/articles/${slug}`)
  redirect("/admin/articles")
}

export async function deleteArticle(formData: FormData) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== "ADMIN") throw new Error("Unauthorized")

  const id = formData.get("id") as string

  // Soft delete — keeps data, removes from public queries
  await prisma.article.update({
    where: { id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  })

  revalidatePath("/admin/articles")
  revalidatePath("/articles")
  redirect("/admin/articles")
}

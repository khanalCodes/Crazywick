"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPrediction(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const type = formData.get("type") as string
  const asset = formData.get("asset") as string
  const direction = formData.get("direction") as string
  const probability = formData.get("probability") as string
  const timeframe = formData.get("timeframe") as string
  const thesis = formData.get("thesis") as string
  const target = formData.get("target") as string

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

  await prisma.prediction.create({
    data: {
      title,
      type: type as any,
      asset,
      direction: direction as any,
      probability: probability ? parseInt(probability) : null,
      timeframe,
      thesis,
      target: target || null,
      authorId: user.id,
      status: "OPEN",
      publishedAt: new Date(),
    },
  })

  revalidatePath("/admin/predictions")
  revalidatePath("/predictions")
  redirect("/admin/predictions")
}
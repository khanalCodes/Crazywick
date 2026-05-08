'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAnalysis(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')

  const asset = formData.get('asset') as string
  const symbol = formData.get('symbol') as string
  const bias = formData.get('bias') as string
  const thesis = formData.get('thesis') as string
  const watchFor = formData.get('watchFor') as string
  const imageUrl = formData.get('imageUrl') as string
  const supportLevels = (formData.get('supportLevels') as string).split(',').map(s => s.trim()).filter(Boolean)
  const resistanceLevels = (formData.get('resistanceLevels') as string).split(',').map(s => s.trim()).filter(Boolean)

  const user = await prisma.user.upsert({
    where: { email: session.user.email! },
    update: {},
    create: {
      email: session.user.email!,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
      role: 'ADMIN',
    },
  })

  await prisma.analysis.create({
    data: {
      asset,
      symbol,
      bias: bias as any,
      thesis,
      watchFor: watchFor || null,
      imageUrl: imageUrl || null,
      supportLevels,
      resistanceLevels,
      authorId: user.id,
      isPublic: true,
    },
  })

  revalidatePath('/admin/analysis')
  revalidatePath('/analysis')
  redirect('/admin/analysis')
}
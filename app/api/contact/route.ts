import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
  }

  if (message.trim().length < 10) {
    return NextResponse.json({ error: "Message is too short." }, { status: 400 })
  }

  // Store as an analytics event — reuses existing schema, no new table needed
  await prisma.analyticsEvent.create({
    data: {
      type: "CONTACT_FORM",
      metadata: {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      },
    },
  })

  return NextResponse.json({ success: true })
}

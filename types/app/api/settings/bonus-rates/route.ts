import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const bonusRatesSchema = z.object({
  resellerBonusRate: z.number().min(0).max(1),
  adminBonusRate: z.number().min(0).max(1),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = bonusRatesSchema.parse(body)

    // Simpan pengaturan
    const setting = await db.setting.upsert({
      where: {
        key: "bonus_rates",
      },
      update: {
        value: JSON.stringify(validatedData),
      },
      create: {
        key: "bonus_rates",
        value: JSON.stringify(validatedData),
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Terjadi kesalahan saat menyimpan pengaturan bonus", details: error }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const setting = await db.setting.findUnique({
      where: {
        key: "bonus_rates",
      },
    })

    if (!setting) {
      return NextResponse.json({
        resellerBonusRate: 0.05,
        adminBonusRate: 0.05,
      })
    }

    return NextResponse.json(JSON.parse(setting.value))
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil pengaturan bonus", details: error }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

// Update the schema to include the new field
const packageTypeSchema = z.object({
  name: z.string().min(1, "Nama jenis paket wajib diisi"),
  description: z.string().optional(),
  icon: z.string().min(1, "Icon wajib dipilih"),
  isBonusEligible: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = packageTypeSchema.parse(body)

    // Update the create function to include the new field
    const packageType = await db.packageType.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        icon: validatedData.icon,
        isBonusEligible: validatedData.isBonusEligible,
      },
    })

    return NextResponse.json(packageType)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Terjadi kesalahan saat membuat jenis paket", details: error }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const packageTypes = await db.packageType.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(packageTypes)
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil jenis paket", details: error }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const packageTypeSchema = z.object({
  name: z.string().min(1, "Nama jenis paket wajib diisi"),
  description: z.string().optional(),
  icon: z.string().min(1, "Icon wajib dipilih"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = packageTypeSchema.parse(body)

    const packageType = await db.packageType.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        icon: validatedData.icon,
      },
    })

    return NextResponse.json(packageType)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    console.error("Error creating package type:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat jenis paket" }, { status: 500 })
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
    console.error("Error fetching package types:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil jenis paket" }, { status: 500 })
  }
}


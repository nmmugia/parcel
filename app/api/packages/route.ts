import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const packageSchema = z.object({
  name: z.string().min(1, "Nama paket wajib diisi"),
  description: z.string().optional(),
  price: z.number().positive("Harga harus lebih dari 0"),
  tenorMonths: z.number().int().positive("Tenor harus lebih dari 0"),
  monthlyAmount: z.number().positive("Cicilan bulanan harus lebih dari 0"),
  packageTypeId: z.string().min(1, "Jenis paket wajib dipilih"),
  isActive: z.boolean().default(true),
  imageUrl: z.string().nullable().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = packageSchema.parse(body)

    const packageData = await db.package.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        tenorMonths: validatedData.tenorMonths,
        monthlyAmount: validatedData.monthlyAmount,
        packageTypeId: validatedData.packageTypeId,
        isActive: validatedData.isActive,
        imageUrl: validatedData.imageUrl,
      },
    })

    return NextResponse.json(packageData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    console.error("Error creating package:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat paket" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get("isActive")

    const whereClause: any = {}

    if (isActive === "true") {
      whereClause.isActive = true
    } else if (isActive === "false") {
      whereClause.isActive = false
    }

    const packages = await db.package.findMany({
      where: whereClause,
      include: {
        packageType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(packages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil paket" }, { status: 500 })
  }
}


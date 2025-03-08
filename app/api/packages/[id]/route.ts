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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageData = await db.package.findUnique({
      where: {
        id: params.id,
      },
      include: {
        packageType: true,
      },
    })

    if (!packageData) {
      return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(packageData)
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil paket" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = packageSchema.parse(body)

    const packageData = await db.package.update({
      where: {
        id: params.id,
      },
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

    console.error("Error updating package:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui paket" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Periksa apakah paket memiliki transaksi terkait
    const transactionCount = await db.transaction.count({
      where: {
        packageId: params.id,
      },
    })

    if (transactionCount > 0) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus paket yang memiliki transaksi terkait" },
        { status: 400 },
      )
    }

    await db.package.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus paket" }, { status: 500 })
  }
}


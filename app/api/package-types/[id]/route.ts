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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageType = await db.packageType.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!packageType) {
      return NextResponse.json({ error: "Jenis paket tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(packageType)
  } catch (error) {
    console.error("Error fetching package type:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil jenis paket" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = packageTypeSchema.parse(body)

    const packageType = await db.packageType.update({
      where: {
        id: params.id,
      },
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

    console.error("Error updating package type:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui jenis paket" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Periksa apakah jenis paket memiliki paket terkait
    const packageCount = await db.package.count({
      where: {
        packageTypeId: params.id,
      },
    })

    if (packageCount > 0) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus jenis paket yang memiliki paket terkait" },
        { status: 400 },
      )
    }

    await db.packageType.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting package type:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus jenis paket" }, { status: 500 })
  }
}


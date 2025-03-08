import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const resellerSchema = z.object({
  name: z.string().min(1, "Nama reseller wajib diisi"),
  email: z.string().email("Email tidak valid"),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reseller = await db.user.findUnique({
      where: {
        id: params.id,
        role: "RESELLER",
      },
    })

    if (!reseller) {
      return NextResponse.json({ error: "Reseller tidak ditemukan" }, { status: 404 })
    }

    // Hapus password dari response
    const { password, ...resellerWithoutPassword } = reseller

    return NextResponse.json(resellerWithoutPassword)
  } catch (error) {
    console.error("Error fetching reseller:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil reseller" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = resellerSchema.parse(body)

    // Periksa apakah reseller ada
    const existingReseller = await db.user.findUnique({
      where: {
        id: params.id,
        role: "RESELLER",
      },
    })

    if (!existingReseller) {
      return NextResponse.json({ error: "Reseller tidak ditemukan" }, { status: 404 })
    }

    // Periksa apakah email sudah digunakan oleh pengguna lain
    if (validatedData.email !== existingReseller.email) {
      const emailExists = await db.user.findUnique({
        where: {
          email: validatedData.email,
        },
      })

      if (emailExists) {
        return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 })
      }
    }

    const reseller = await db.user.update({
      where: {
        id: params.id,
      },
      data: {
        name: validatedData.name,
        email: validatedData.email,
      },
    })

    // Hapus password dari response
    const { password, ...resellerWithoutPassword } = reseller

    return NextResponse.json(resellerWithoutPassword)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    console.error("Error updating reseller:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui reseller" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Periksa apakah reseller memiliki transaksi terkait
    const transactionCount = await db.transaction.count({
      where: {
        resellerId: params.id,
      },
    })

    if (transactionCount > 0) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus reseller yang memiliki transaksi terkait" },
        { status: 400 },
      )
    }

    await db.user.delete({
      where: {
        id: params.id,
        role: "RESELLER",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting reseller:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus reseller" }, { status: 500 })
  }
}


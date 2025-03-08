import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transaction = await db.transaction.findUnique({
      where: {
        id: params.id,
      },
      include: {
        package: {
          include: {
            packageType: true,
          },
        },
        payments: {
          orderBy: {
            dueDate: "asc",
          },
        },
        reseller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 })
    }

    // Verifikasi bahwa pengguna memiliki akses ke transaksi ini
    if (session.user.role === "RESELLER" && session.user.id !== transaction.resellerId) {
      return NextResponse.json({ error: "Anda tidak memiliki akses ke transaksi ini" }, { status: 403 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil transaksi" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !["ACTIVE", "COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 })
    }

    const transaction = await db.transaction.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui transaksi" }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verifikasi bahwa pembayaran ada
    const payment = await db.payment.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!payment) {
      return NextResponse.json({ error: "Pembayaran tidak ditemukan" }, { status: 404 })
    }

    // Verifikasi bahwa pembayaran menunggu persetujuan
    if (payment.status !== "WAITING_FOR_APPROVAL") {
      return NextResponse.json({ error: "Pembayaran ini tidak dalam status menunggu persetujuan" }, { status: 400 })
    }

    // Update pembayaran
    const updatedPayment = await db.payment.update({
      where: {
        id: params.id,
      },
      data: {
        status: "REJECTED",
      },
    })

    return NextResponse.json(updatedPayment)
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat menolak pembayaran", details: error }, { status: 500 })
  }
}


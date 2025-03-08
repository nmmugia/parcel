import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const approvePaymentSchema = z.object({
  resellerBonus: z.number().min(0, "Bonus reseller tidak boleh negatif"),
  adminBonus: z.number().min(0, "Bonus admin tidak boleh negatif"),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = approvePaymentSchema.parse(body)

    // Verifikasi bahwa pembayaran ada
    const payment = await db.payment.findUnique({
      where: {
        id: params.id,
      },
      include: {
        transaction: true,
      },
    })

    if (!payment) {
      return NextResponse.json({ error: "Pembayaran tidak ditemukan" }, { status: 404 })
    }

    // Verifikasi bahwa pembayaran belum disetujui
    if (payment.status !== "PENDING") {
      return NextResponse.json({ error: "Pembayaran ini sudah diproses sebelumnya" }, { status: 400 })
    }

    // Verifikasi bahwa pembayaran memiliki bukti
    if (!payment.proofImageUrl) {
      return NextResponse.json({ error: "Pembayaran ini belum memiliki bukti pembayaran" }, { status: 400 })
    }

    // Update pembayaran
    const updatedPayment = await db.payment.update({
      where: {
        id: params.id,
      },
      data: {
        status: "APPROVED",
        resellerBonus: validatedData.resellerBonus,
        adminBonus: validatedData.adminBonus,
      },
    })

    // Periksa apakah semua pembayaran untuk transaksi ini sudah disetujui
    const allPayments = await db.payment.findMany({
      where: {
        transactionId: payment.transactionId,
      },
    })

    const allApproved = allPayments.every((p) => p.status === "APPROVED")

    // Jika semua pembayaran sudah disetujui, update status transaksi menjadi COMPLETED
    if (allApproved) {
      await db.transaction.update({
        where: {
          id: payment.transactionId,
        },
        data: {
          status: "COMPLETED",
        },
      })
    }

    return NextResponse.json(updatedPayment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    console.error("Error approving payment:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat menyetujui pembayaran" }, { status: 500 })
  }
}


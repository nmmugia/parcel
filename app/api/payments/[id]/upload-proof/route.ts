import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const uploadProofSchema = z.object({
  proofImageUrl: z.string().url("URL bukti pembayaran tidak valid"),
  transactionId: z.string().min(1, "ID transaksi wajib diisi"),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = uploadProofSchema.parse(body)

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

    // Verifikasi bahwa pembayaran milik transaksi yang benar
    if (payment.transactionId !== validatedData.transactionId) {
      return NextResponse.json({ error: "Pembayaran tidak terkait dengan transaksi yang diberikan" }, { status: 400 })
    }

    // Verifikasi bahwa pengguna memiliki akses ke pembayaran ini
    if (session.user.role === "RESELLER" && session.user.id !== payment.resellerId) {
      return NextResponse.json({ error: "Anda tidak memiliki akses ke pembayaran ini" }, { status: 403 })
    }

    // Verifikasi bahwa pembayaran belum memiliki bukti
    if (payment.proofImageUrl) {
      return NextResponse.json({ error: "Pembayaran ini sudah memiliki bukti pembayaran" }, { status: 400 })
    }

    // Update pembayaran dengan bukti dan tanggal bayar
    const updatedPayment = await db.payment.update({
      where: {
        id: params.id,
      },
      data: {
        proofImageUrl: validatedData.proofImageUrl,
        paidDate: new Date(),
        status: "PENDING", // Status tetap pending sampai admin menyetujui
      },
    })

    return NextResponse.json(updatedPayment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    console.error("Error uploading payment proof:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengunggah bukti pembayaran" }, { status: 500 })
  }
}


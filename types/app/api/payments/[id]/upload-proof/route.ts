import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { sendEmail } from "@/lib/email"

// Update the schema to include payment method
const uploadProofSchema = z.object({
  proofImageUrl: z.string().url("URL bukti pembayaran tidak valid").nullable().optional(),
  transactionId: z.string().min(1, "ID transaksi wajib diisi"),
  paymentMethod: z.enum(["CASH", "TRANSFER"]).default("TRANSFER"),
})

// Update the POST handler to handle both payment methods
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
        transaction: {
          include: {
            package: true,
            reseller: true,
          },
        },
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

    // Verifikasi bahwa pembayaran dalam status yang benar (WAITING_FOR_PAYMENT atau REJECTED)
    if (payment.status !== "WAITING_FOR_PAYMENT" && payment.status !== "REJECTED") {
      return NextResponse.json(
        {
          error: "Pembayaran ini tidak dalam status yang dapat diubah",
        },
        { status: 400 },
      )
    }

    // Update pembayaran dengan bukti dan tanggal bayar
    const updatedPayment = await db.payment.update({
      where: {
        id: params.id,
      },
      data: {
        proofImageUrl: validatedData.proofImageUrl,
        paymentMethod: validatedData.paymentMethod,
        paidDate: new Date(),
        status: "WAITING_FOR_APPROVAL", // Status berubah menjadi menunggu persetujuan
      },
    })

    // Kirim email notifikasi ke admin
    const admin = await db.user.findFirst({
      where: {
        role: "ADMIN",
      },
    })

    if (admin && admin.email) {
      const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      const approvalUrl = `${appUrl}/admin/payments/${payment.id}`

      await sendEmail({
        to: admin.email,
        subject: `Pembayaran Baru Menunggu Persetujuan - ${payment.transaction.customerName}`,
        html: `
          <h1>Pembayaran Baru Menunggu Persetujuan</h1>
          <p>Reseller <strong>${payment.transaction.reseller.name}</strong> telah mengunggah bukti pembayaran untuk:</p>
          <ul>
            <li>Pelanggan: ${payment.transaction.customerName}</li>
            <li>Paket: ${payment.transaction.package.name}</li>
            <li>Jumlah: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(payment.amount)}</li>
            <li>Metode: ${validatedData.paymentMethod === "TRANSFER" ? "Transfer Bank" : "Tunai"}</li>
            <li>Tanggal Batas Pembayaran: ${new Date(payment.dueDate).toLocaleDateString("id-ID")}</li>
          </ul>
          <p>Silakan klik tombol di bawah untuk menyetujui atau menolak pembayaran ini:</p>
          <a href="${approvalUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Lihat Detail Pembayaran</a>
        `,
      })
    }

    return NextResponse.json(updatedPayment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Terjadi kesalahan saat mengunggah bukti pembayaran", details: error }, { status: 500 })
  }
}


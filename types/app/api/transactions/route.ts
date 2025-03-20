import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { addWeeks } from "date-fns"

const transactionSchema = z.object({
  customerName: z.string().min(1, "Nama pelanggan wajib diisi"),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
  packageId: z.string().min(1, "ID paket wajib diisi"),
  resellerId: z.string().min(1, "ID reseller wajib diisi"),
  tenorWeeks: z.number().int().positive("Jumlah Minggu harus lebih dari 0"),
  weeklyAmount: z.number().positive("Pembayaran per Minggu harus lebih dari 0"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = transactionSchema.parse(body)

    // Verifikasi bahwa reseller yang membuat transaksi adalah pengguna yang terautentikasi
    // atau admin yang bertindak atas nama reseller
    if (session.user.role === "RESELLER" && session.user.id !== validatedData.resellerId) {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin untuk membuat transaksi atas nama reseller lain" },
        { status: 403 },
      )
    }

    // Verifikasi bahwa paket ada dan aktif
    const packageData = await db.package.findUnique({
      where: {
        id: validatedData.packageId,
        isActive: true,
      },
    })

    if (!packageData) {
      return NextResponse.json({ error: "Paket tidak ditemukan atau tidak aktif" }, { status: 404 })
    }

    // Buat transaksi dalam database
    const transaction = await db.transaction.create({
      data: {
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        customerAddress: validatedData.customerAddress,
        tenorWeeks: validatedData.tenorWeeks,
        weeklyAmount: validatedData.weeklyAmount,
        status: "ACTIVE",
        packageId: validatedData.packageId,
        resellerId: validatedData.resellerId,
      },
    })

    // Buat pembayaran untuk setiap minggu
    const payments = []
    const now = new Date()

    for (let i = 0; i < validatedData.tenorWeeks; i++) {
      const dueDate = addWeeks(now, i)

      const payment = await db.payment.create({
        data: {
          amount: validatedData.weeklyAmount,
          paymentMethod: "TRANSFER", // Default ke transfer
          dueDate,
          status: "WAITING_FOR_PAYMENT", // Status awal adalah menunggu pembayaran
          transactionId: transaction.id,
          resellerId: validatedData.resellerId,
          // Bonus akan dihitung saat pembayaran disetujui
        },
      })

      payments.push(payment)
    }

    return NextResponse.json({
      id: transaction.id,
      ...transaction,
      payments,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Terjadi kesalahan saat membuat transaksi", details: error }, { status: 500 })
  }
}


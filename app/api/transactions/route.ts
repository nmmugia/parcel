import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { addMonths } from "date-fns"

const transactionSchema = z.object({
  customerName: z.string().min(1, "Nama pelanggan wajib diisi"),
  customerPhone: z.string().min(1, "Nomor telepon wajib diisi"),
  customerAddress: z.string().optional(),
  packageId: z.string().min(1, "ID paket wajib diisi"),
  resellerId: z.string().min(1, "ID reseller wajib diisi"),
  totalAmount: z.number().positive("Total harus lebih dari 0"),
  tenorMonths: z.number().int().positive("Tenor harus lebih dari 0"),
  monthlyAmount: z.number().positive("Cicilan bulanan harus lebih dari 0"),
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
        totalAmount: validatedData.totalAmount,
        tenorMonths: validatedData.tenorMonths,
        monthlyAmount: validatedData.monthlyAmount,
        status: "ACTIVE",
        packageId: validatedData.packageId,
        resellerId: validatedData.resellerId,
      },
    })

    // Buat pembayaran untuk setiap bulan
    const payments = []
    const now = new Date()

    for (let i = 0; i < validatedData.tenorMonths; i++) {
      const dueDate = addMonths(now, i)

      const payment = await db.payment.create({
        data: {
          amount: validatedData.monthlyAmount,
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

    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat transaksi" }, { status: 500 })
  }
}


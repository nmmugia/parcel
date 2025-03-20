import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { uploadToS3 } from "@/lib/s3"
import { z } from "zod"
import { sendEmail } from "@/lib/email"
import { v4 as uuidv4 } from "uuid" // Add this import

// Schema for multiple payment uploads
const uploadMultipleProofSchema = z.object({
  paymentIds: z.string().transform((val) => {
    try {
      return JSON.parse(val) as string[]
    } catch (e) {
      throw new Error("Invalid payment IDs format")
    }
  }),
  transactionId: z.string().min(1, "ID transaksi wajib diisi"),
  paymentMethod: z.enum(["cash", "transfer"]).default("transfer"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the form data
    const formData = await request.formData()

    // Get file if it exists
    const file = formData.get("file") as File | null

    // Get other form data
    const paymentMethod = formData.get("paymentMethod") as string
    const notes = formData.get("notes") as string
    const transactionId = formData.get("transactionId") as string
    const paymentIdsJson = formData.get("paymentIds") as string

    // Validate the data
    const validatedData = uploadMultipleProofSchema.parse({
      paymentIds: paymentIdsJson,
      transactionId,
      paymentMethod,
      notes,
    })

    // Upload file to S3 if it exists and payment method is transfer
    let proofImageUrl: string | null = null

    if (file && validatedData.paymentMethod === "transfer") {
      const fileName = `payment-proofs/${Date.now()}-${file.name}`
      proofImageUrl = await uploadToS3(file, fileName)
    }

    // Verify that all payments exist and belong to the same transaction
    const payments = await db.payment.findMany({
      where: {
        id: {
          in: validatedData.paymentIds,
        },
        transactionId: validatedData.transactionId,
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

    // Check if all requested payments were found
    if (payments.length !== validatedData.paymentIds.length) {
      return NextResponse.json({ error: "Beberapa pembayaran tidak ditemukan" }, { status: 404 })
    }

    // Verify that the user has access to these payments
    if (session.user.role === "RESELLER" && payments.some((p) => p.resellerId !== session.user.id)) {
      return NextResponse.json({ error: "Anda tidak memiliki akses ke beberapa pembayaran ini" }, { status: 403 })
    }

    // Verify that all payments are in the correct status
    if (payments.some((p) => p.status !== "WAITING_FOR_PAYMENT" && p.status !== "REJECTED")) {
      return NextResponse.json(
        {
          error: "Beberapa pembayaran tidak dalam status yang dapat diubah",
        },
        { status: 400 },
      )
    }

    // Generate a unique batch ID for this group of payments
    const batchId = uuidv4()

    // Update all payments with the proof and change status
    const updatedPayments = await Promise.all(
      payments.map((payment) =>
        db.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            proofImageUrl,
            paymentMethod: validatedData.paymentMethod.toUpperCase(),
            paidDate: new Date(),
            status: "WAITING_FOR_APPROVAL", // Status berubah menjadi menunggu persetujuan
            batchId: batchId, // Assign the batch ID to each payment
          },
        }),
      ),
    )

    // Send email notification to admin
    const admin = await db.user.findFirst({
      where: {
        role: "ADMIN",
      },
    })

    if (admin && admin.email) {
      const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      // Link to the batch approval page instead of a single payment
      const approvalUrl = `${appUrl}/admin/payments/batch/${batchId}`

      const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
      const formattedAmount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(totalAmount)

      await sendEmail({
        to: admin.email,
        subject: `Pembayaran Sekaligus Menunggu Persetujuan - ${payments[0].transaction.customerName}`,
        html: `
          <h1>Pembayaran Sekaligus Menunggu Persetujuan</h1>
          <p>Reseller <strong>${payments[0].transaction.reseller.name}</strong> telah mengunggah bukti pembayaran untuk ${payments.length} cicilan:</p>
          <ul>
            <li>Pelanggan: ${payments[0].transaction.customerName}</li>
            <li>Paket: ${payments[0].transaction.package.name}</li>
            <li>Jumlah Total: ${formattedAmount}</li>
            <li>Metode: ${validatedData.paymentMethod === "transfer" ? "Transfer Bank" : "Tunai"}</li>
            <li>Jumlah Cicilan: ${payments.length}</li>
          </ul>
          <p>Silakan klik tombol di bawah untuk menyetujui atau menolak pembayaran ini:</p>
          <a href="${approvalUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Lihat Detail Pembayaran</a>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      message: `${payments.length} pembayaran berhasil diproses`,
      payments: updatedPayments,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    console.error("Error uploading multiple payment proofs:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengunggah bukti pembayaran" }, { status: 500 })
  }
}


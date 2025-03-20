import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { sendPaymentApprovalEmail } from "@/lib/email"
import { isBefore, addDays } from "date-fns"


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

    // Verifikasi bahwa pembayaran menunggu persetujuan
    if (payment.status !== "WAITING_FOR_APPROVAL") {
      return NextResponse.json({ error: "Pembayaran ini tidak dalam status menunggu persetujuan" }, { status: 400 })
    }

    // Update pembayaran

    // Check if payment is late
    const isLate = payment.paidDate ? isBefore(addDays(payment.dueDate, 1), payment.paidDate) : true;

    // Update the payment status
    const updatedPayment = await db.payment.update({
      where: { id: params.id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        isLate,
      },
    })

    // Periksa apakah semua pembayaran untuk transaksi ini sudah disetujui
    const allPayments = await db.payment.findMany({
      where: {
        transactionId: payment.transactionId,
      },
    })

    const allApproved = allPayments.every((p) => p.status === "APPROVED")
    // If payment is late, update reseller's bonus eligibility
    if (isLate) {
      await db.transaction.update({
        where: { id: payment.transactionId },
        data: {
          isBonusEligible: false,
        },
      })
    }
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

    // Send email notification
    if (payment.transaction.reseller.email) {
      await sendPaymentApprovalEmail({
        to: payment.transaction.reseller.email,
        resellerName: payment.transaction.reseller.name,
        packageName: payment.transaction.package.name,
        paymentAmount: payment.amount,
        transactionId: payment.transactionId,
        dueDate: payment.dueDate,
        paymentDate: payment.paidDate,
      })
    }

    return NextResponse.json(updatedPayment)
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Terjadi kesalahan saat menyetujui pembayaran", details: error }, { status: 500 })
  }
}


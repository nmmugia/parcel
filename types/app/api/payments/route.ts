import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const hasProof = searchParams.get("hasProof")

    const whereClause: any = {}

    // Filter berdasarkan role
    if (session.user.role === "RESELLER") {
      whereClause.resellerId = session.user.id
    }

    // Filter berdasarkan status
    if (status && ["WAITING_FOR_APPROVAL", "APPROVED", "REJECTED"].includes(status)) {
      whereClause.status = status
    }

    // Filter berdasarkan bukti pembayaran
    if (hasProof === "true") {
      whereClause.proofImageUrl = {
        not: null,
      }
    } else if (hasProof === "false") {
      whereClause.proofImageUrl = null
    }

    const payments = await db.payment.findMany({
      where: whereClause,
      include: {
        transaction: {
          include: {
            package: true,
            reseller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          status: "asc",
        },
        {
          dueDate: "asc",
        },
      ],
    })

    return NextResponse.json(payments)
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil pembayaran", details: error }, { status: 500 })
  }
}


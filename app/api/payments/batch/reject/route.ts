import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { batchId } = await request.json()

        if (!batchId) {
            return NextResponse.json({ error: "Batch ID is required" }, { status: 400 })
        }

        // Get all payments in the batch
        const payments = await db.payment.findMany({
            where: {
                batchId: batchId,
                status: "WAITING_FOR_APPROVAL",
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

        if (payments.length === 0) {
            return NextResponse.json({ error: "No pending payments found in this batch" }, { status: 404 })
        }

        // Process each payment
        const updatedPayments = await Promise.all(
            payments.map(async (payment) => {
                return db.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: "REJECTED",
                    },
                })
            }),
        )

        return NextResponse.json({
            success: true,
            message: `${updatedPayments.length} payments rejected successfully`,
            payments: updatedPayments,
        })
    } catch (error) {
        console.error("Error rejecting batch payments:", error)
        return NextResponse.json({ error: "Failed to reject payments" }, { status: 500 })
    }
}


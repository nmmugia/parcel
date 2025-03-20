import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams
        const startDateParam = searchParams.get("startDate")
        const endDateParam = searchParams.get("endDate")

        // Parse dates or use defaults
        const startDate = startDateParam ? new Date(startDateParam) : new Date(0)
        const endDate = endDateParam ? new Date(endDateParam) : new Date()

        // Get all payments within the date range
        const payments = await db.payment.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                transaction: true,
                reseller: true,
            },
        })

        // Calculate total amounts
        const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0)

        // Approved payments
        const approvedPayments = payments.filter((p) => p.status === "APPROVED")
        const approvedAmount = approvedPayments.reduce((sum, p) => sum + Number(p.amount), 0)

        // Late vs On-time approved payments
        const lateApprovedPayments = approvedPayments.filter((p) => p.isLate)
        const lateApprovedAmount = lateApprovedPayments.reduce((sum, p) => sum + Number(p.amount), 0)
        const onTimeApprovedAmount = approvedAmount - lateApprovedAmount

        // Pending payments (not approved yet)
        const pendingPayments = payments.filter((p) => p.status !== "APPROVED")
        const pendingAmount = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0)

        // Waiting for payment
        const waitingForPaymentAmount = payments
            .filter((p) => p.status === "WAITING_FOR_PAYMENT")
            .reduce((sum, p) => sum + Number(p.amount), 0)

        // Waiting for approval
        const waitingForApprovalAmount = payments
            .filter((p) => p.status === "WAITING_FOR_APPROVAL")
            .reduce((sum, p) => sum + Number(p.amount), 0)

        // Rejected payments
        const rejectedAmount = payments.filter((p) => p.status === "REJECTED").reduce((sum, p) => sum + Number(p.amount), 0)

        // Monthly payment data
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const month = new Date(new Date().getFullYear(), i, 1)
            const monthName = month.toLocaleString("default", { month: "short" })

            const monthPayments = payments.filter((p) => {
                const paymentDate = new Date(p.createdAt)
                return paymentDate.getMonth() === month.getMonth() && paymentDate.getFullYear() === month.getFullYear()
            })

            const approved = monthPayments
                .filter((p) => p.status === "APPROVED")
                .reduce((sum, p) => sum + Number(p.amount), 0)

            const pending = monthPayments.filter((p) => p.status !== "APPROVED").reduce((sum, p) => sum + Number(p.amount), 0)

            return {
                name: monthName,
                approved,
                pending,
            }
        })

        // Payment status breakdown for pie chart
        const paymentStatusData = [
            { name: "Disetujui (Tepat Waktu)", value: onTimeApprovedAmount },
            { name: "Disetujui (Telat)", value: lateApprovedAmount },
            { name: "Menunggu Pembayaran", value: waitingForPaymentAmount },
            { name: "Menunggu Persetujuan", value: waitingForApprovalAmount },
            { name: "Ditolak", value: rejectedAmount },
        ]

        return NextResponse.json({
            totalAmount,
            approvedAmount,
            pendingAmount,
            lateApprovedAmount,
            onTimeApprovedAmount,
            waitingForPaymentAmount,
            waitingForApprovalAmount,
            rejectedAmount,
            monthlyData,
            paymentStatusData,
        })
    } catch (error) {
        console.error("Error fetching payment reports:", error)
        return NextResponse.json({ error: "Failed to fetch payment reports" }, { status: 500 })
    }
}


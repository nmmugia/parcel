import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { format, endOfWeek, eachWeekOfInterval, addWeeks, subDays } from "date-fns"

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

        // Get all transactions within the date range
        const transactions = await db.transaction.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                package: true,
                reseller: true,
            },
        })

        // Group transactions by week
        const weeks = eachWeekOfInterval({
            start: startDate,
            end: endDate,
        })

        const weeklyData = weeks.map((weekStart) => {
            const weekEnd = endOfWeek(weekStart)
            const weekTransactions = transactions.filter((t) => {
                const date = new Date(t.createdAt)
                return date >= weekStart && date <= weekEnd
            })

            const totalAmount = weekTransactions.reduce((sum, t) => sum + (Number(t.weeklyAmount) * Number(t.tenorWeeks)), 0)

            return {
                name: `${format(weekStart, "MMM d")} - ${format((subDays(addWeeks(weekStart, 1), 1)), "MMM d")}`,
                amount: totalAmount,
                count: weekTransactions.length,
            }
        })

        return NextResponse.json(weeklyData)
    } catch (error) {
        console.error("Error fetching transaction reports:", error)
        return NextResponse.json({ error: "Failed to fetch transaction reports" }, { status: 500 })
    }
}


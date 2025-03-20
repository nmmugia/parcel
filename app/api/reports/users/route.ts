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

        // Get all resellers
        const resellers = await db.user.findMany({
            where: {
                role: "RESELLER",
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                payments: true,
                transactions: true,
            },
        })

        // Count active resellers (those with at least one transaction in the period)
        const activeResellers = resellers.filter((r) =>
            r.transactions.some((t) => new Date(t.createdAt) >= startDate && new Date(t.createdAt) <= endDate),
        ).length

        // Count inactive resellers
        const inactiveResellers = resellers.length - activeResellers

        const userData = [
            { name: "Aktif", value: activeResellers },
            { name: "Tidak Aktif", value: inactiveResellers },
        ]

        return NextResponse.json(userData)
    } catch (error) {
        console.error("Error fetching user reports:", error)
        return NextResponse.json({ error: "Failed to fetch user reports" }, { status: 500 })
    }
}


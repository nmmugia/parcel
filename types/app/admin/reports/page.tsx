import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { ReportsOverview } from "@/components/admin/reports-overview"

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  // Ambil data untuk laporan

  // Total transaksi
  const totalTransactions = await db.transaction.count()

  // Total transaksi aktif
  const activeTransactions = await db.transaction.count({
    where: {
      status: "ACTIVE",
    },
  })

  // Total transaksi selesai
  const completedTransactions = await db.transaction.count({
    where: {
      status: "COMPLETED",
    },
  })

  // Total pembayaran
  const totalPayments = await db.payment.count()

  // Total pembayaran yang disetujui
  const approvedPayments = await db.payment.count({
    where: {
      status: "APPROVED",
    },
  })

  // Total pembayaran yang ditolak
  const rejectedPayments = await db.payment.count({
    where: {
      status: "REJECTED",
    },
  })

  // Total pendapatan
  const totalRevenue = await db.payment.aggregate({
    where: {
      status: "APPROVED",
    },
    _sum: {
      amount: true,
    },
  })

  // Transaksi per reseller
  const transactionsPerReseller = await db.transaction.groupBy({
    by: ["resellerId"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  })

  // Ambil data reseller untuk transaksi per reseller
  const resellerIds = transactionsPerReseller.map((item) => item.resellerId)
  const resellers = await db.user.findMany({
    where: {
      id: {
        in: resellerIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  })

  // Gabungkan data transaksi per reseller dengan data reseller
  const transactionsPerResellerWithNames = transactionsPerReseller.map((item) => {
    const reseller = resellers.find((r) => r.id === item.resellerId)
    return {
      resellerId: item.resellerId,
      resellerName: reseller?.name || "Unknown",
      count: item._count.id,
    }
  })

  // Get monthly transaction data for charts
  const monthlyTransactions = await db.transaction.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  // Format monthly data for charts
  const monthlyData = monthlyTransactions.map((item) => ({
    month: new Date(item.createdAt).toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
    count: item._count.id,
  }))

  // Get transaction data by status for charts
  const transactionsByStatus = [
    { status: "ACTIVE", count: activeTransactions },
    { status: "COMPLETED", count: completedTransactions },
    { status: "CANCELLED", count: await db.transaction.count({ where: { status: "CANCELLED" } }) },
  ]

  return (
    <AdminLayout>
      <div className="p-6">
        <ReportsOverview
          totalTransactions={totalTransactions}
          activeTransactions={activeTransactions}
          completedTransactions={completedTransactions}
          totalPayments={totalPayments}
          approvedPayments={approvedPayments}
          rejectedPayments={rejectedPayments}
          totalRevenue={totalRevenue._sum.amount || 0}
          transactionsPerReseller={transactionsPerResellerWithNames}
          monthlyData={monthlyData}
          transactionsByStatus={transactionsByStatus}
        />
      </div>
    </AdminLayout>
  )
}


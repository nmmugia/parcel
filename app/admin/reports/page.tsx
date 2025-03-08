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

  // Total bonus reseller
  const totalResellerBonus = await db.payment.aggregate({
    where: {
      status: "APPROVED",
      resellerBonus: {
        not: null,
      },
    },
    _sum: {
      resellerBonus: true,
    },
  })

  // Total bonus admin
  const totalAdminBonus = await db.payment.aggregate({
    where: {
      status: "APPROVED",
      adminBonus: {
        not: null,
      },
    },
    _sum: {
      adminBonus: true,
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

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Laporan</h1>
        <ReportsOverview
          totalTransactions={totalTransactions}
          activeTransactions={activeTransactions}
          completedTransactions={completedTransactions}
          totalPayments={totalPayments}
          approvedPayments={approvedPayments}
          rejectedPayments={rejectedPayments}
          totalRevenue={totalRevenue._sum.amount || 0}
          totalResellerBonus={totalResellerBonus._sum.resellerBonus || 0}
          totalAdminBonus={totalAdminBonus._sum.adminBonus || 0}
          transactionsPerReseller={transactionsPerResellerWithNames}
        />
      </div>
    </AdminLayout>
  )
}


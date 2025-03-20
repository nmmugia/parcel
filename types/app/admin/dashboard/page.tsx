import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  // Ambil data untuk dashboard
  const totalPackages = await db.package.count()
  const totalResellers = await db.user.count({
    where: {
      role: "RESELLER",
    },
  })
  const totalTransactions = await db.transaction.count()

  // Pembayaran yang menunggu persetujuan
  const pendingPayments = await db.payment.count({
    where: {
      status: "WAITING_FOR_APPROVAL",
      proofImageUrl: {
        not: null,
      },
    },
  })

  // Total pendapatan (dari pembayaran yang disetujui)
  const totalRevenue = await db.payment.aggregate({
    where: {
      status: "APPROVED",
    },
    _sum: {
      amount: true,
    },
  })


  // Transaksi terbaru
  const recentTransactions = await db.transaction.findMany({
    include: {
      package: true,
      reseller: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  })

  // Pembayaran yang menunggu persetujuan
  const pendingApprovalPayments = await db.payment.findMany({
    where: {
      status: "WAITING_FOR_APPROVAL",
      proofImageUrl: {
        not: null,
      },
    },
    include: {
      transaction: {
        include: {
          package: true,
          reseller: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      paidDate: "desc",
    },
    take: 5,
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
        <AdminDashboard
          totalPackages={totalPackages}
          totalResellers={totalResellers}
          totalTransactions={totalTransactions}
          pendingPayments={pendingPayments}
          totalRevenue={totalRevenue._sum.amount || 0}
          recentTransactions={recentTransactions}
          pendingApprovalPayments={pendingApprovalPayments}
        />
      </div>
    </AdminLayout>
  )
}


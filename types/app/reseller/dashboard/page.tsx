import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResellerLayout } from "@/components/layouts/reseller-layout"
import { ResellerDashboard } from "@/components/reseller/reseller-dashboard"

export default async function ResellerDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "RESELLER") {
    redirect("/")
  }

  // Ambil data untuk dashboard
  const activeTransactions = await db.transaction.count({
    where: {
      resellerId: session.user.id,
      status: "ACTIVE",
    },
  })

  const pendingPayments = await db.payment.count({
    where: {
      resellerId: session.user.id,
      status: "WAITING_FOR_PAYMENT",
      proofImageUrl: null,
    },
  })

  const approvedPayments = await db.payment.count({
    where: {
      resellerId: session.user.id,
      status: "APPROVED",
    },
  })

  const totalBonus = await db.payment.aggregate({
    where: {
      resellerId: session.user.id,
      status: "APPROVED",
      resellerBonus: {
        not: null,
      },
    },
    _sum: {
      resellerBonus: true,
    },
  })

  const recentTransactions = await db.transaction.findMany({
    where: {
      resellerId: session.user.id,
    },
    include: {
      package: true,
      payments: {
        where: {
          status: "WAITING_FOR_PAYMENT",
          proofImageUrl: null,
        },
        orderBy: {
          dueDate: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  })

  return (
    <ResellerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Reseller</h1>
        <ResellerDashboard
          activeTransactions={activeTransactions}
          pendingPayments={pendingPayments}
          approvedPayments={approvedPayments}
          totalBonus={totalBonus._sum.resellerBonus || 0}
          recentTransactions={recentTransactions}
        />
      </div>
    </ResellerLayout>
  )
}


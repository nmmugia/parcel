import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { AdminPaymentManagement } from "@/components/admin/admin-payment-management"

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const payments = await db.payment.findMany({
    where: {
      transaction: {
        status: {
          notIn: ["CANCELLED", "COMPLETED"],
        },
      },
    },
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

  // Get bonus rates from settings
  const bonusRates = await db.setting.findFirst({
    where: {
      key: "bonusRates",
    },
  })

  const rates = bonusRates
    ? JSON.parse(bonusRates.value)
    : {
        resellerBonusRate: 0.1, // Default 10%
        adminBonusRate: 0.05, // Default 5%
      }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manajemen Pembayaran</h1>
        <AdminPaymentManagement payments={payments} bonusRates={rates} />
      </div>
    </AdminLayout>
  )
}


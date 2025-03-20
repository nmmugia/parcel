import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { AdminPaymentDetail } from "@/components/admin/admin-payment-detail"

interface AdminPaymentDetailPageProps {
  params: {
    id: string
  }
}

export default async function AdminPaymentDetailPage({ params }: AdminPaymentDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const payment = await db.payment.findUnique({
    where: {
      id: params.id,
    },
    include: {
      transaction: {
        include: {
          package: {
            include: {
              packageType: {
                select: {
                  isBonusEligible: true,
                }
              },
            },
          },
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
  })

  if (!payment) {
    notFound()
  }

  // Ambil pengaturan bonus
  const settings = await db.setting.findFirst({
    where: {
      key: "bonus_rates",
    },
  })

  let bonusRates = {
    resellerBonusRate: 0.05, // Default 5%
    adminBonusRate: 0.05, // Default 5%
  }

  if (settings && settings.value) {
    try {
      bonusRates = JSON.parse(settings.value)
    } catch (error) {
      console.error("Error parsing bonus rates:", error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <AdminPaymentDetail payment={payment} bonusRates={bonusRates} />
      </div>
    </AdminLayout>
  )
}


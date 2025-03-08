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

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manajemen Pembayaran</h1>
        <AdminPaymentManagement payments={payments} />
      </div>
    </AdminLayout>
  )
}


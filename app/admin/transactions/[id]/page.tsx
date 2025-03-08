import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { AdminTransactionDetail } from "@/components/admin/admin-transaction-detail"

interface AdminTransactionDetailPageProps {
  params: {
    id: string
  }
}

export default async function AdminTransactionDetailPage({ params }: AdminTransactionDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const transaction = await db.transaction.findUnique({
    where: {
      id: params.id,
    },
    include: {
      package: {
        include: {
          packageType: true,
        },
      },
      reseller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payments: {
        orderBy: {
          dueDate: "asc",
        },
      },
    },
  })

  if (!transaction) {
    notFound()
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <AdminTransactionDetail transaction={transaction} />
      </div>
    </AdminLayout>
  )
}


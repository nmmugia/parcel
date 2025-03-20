import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { AdminTransactionList } from "@/components/admin/admin-transaction-list"

export default async function AdminTransactionsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const transactions = await db.transaction.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manajemen Transaksi</h1>
        <AdminTransactionList transactions={transactions} />
      </div>
    </AdminLayout>
  )
}


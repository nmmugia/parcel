import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { AdminTransactionList } from "@/components/admin/admin-transaction-list"

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 12
  const skip = (page - 1) * limit

  // Get total count for pagination
  const totalCount = await db.transaction.count()

  // Get paginated transactions
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
    skip,
    take: limit,
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manajemen Transaksi</h1>
        <AdminTransactionList transactions={transactions} totalCount={totalCount} currentPage={page} pageSize={limit} />
      </div>
    </AdminLayout>
  )
}


import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResellerLayout } from "@/components/layouts/reseller-layout"
import { TransactionList } from "@/components/reseller/transaction-list"

export default async function ResellerTransactionsPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "RESELLER") {
    redirect("/")
  }

  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const skip = (page - 1) * limit

  // Get total count for pagination
  const totalCount = await db.transaction.count({
    where: {
      resellerId: session.user.id,
    },
  })

  // Get paginated transactions
  const transactions = await db.transaction.findMany({
    where: {
      resellerId: session.user.id,
    },
    include: {
      package: {
        include: {
          packageType: true,
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
    <ResellerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Transaksi Saya</h1>
        <TransactionList transactions={transactions} totalCount={totalCount} currentPage={page} pageSize={limit} />
      </div>
    </ResellerLayout>
  )
}


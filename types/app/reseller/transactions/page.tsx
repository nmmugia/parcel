import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResellerLayout } from "@/components/layouts/reseller-layout"
import { TransactionList } from "@/components/reseller/transaction-list"

export default async function ResellerTransactionsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "RESELLER") {
    redirect("/")
  }

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
  })

  return (
    <ResellerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Transaksi Saya</h1>
        <TransactionList transactions={transactions} />
      </div>
    </ResellerLayout>
  )
}


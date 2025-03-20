import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResellerLayout } from "@/components/layouts/reseller-layout"
import { TransactionDetail } from "@/components/reseller/transaction-detail"

interface TransactionDetailPageProps {
  params: {
    id: string
  }
}

export default async function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "RESELLER") {
    redirect("/")
  }

  const transaction = await db.transaction.findUnique({
    where: {
      id: params.id,
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
  })

  if (!transaction) {
    notFound()
  }

  return (
    <ResellerLayout>
      <div className="p-6">
        <TransactionDetail transaction={transaction} />
      </div>
    </ResellerLayout>
  )
}


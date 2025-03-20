import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { BatchPaymentApproval } from "@/components/admin/batch-payment-approval"

interface BatchPaymentPageProps {
  params: {
    batchId: string
  }
}

export default async function BatchPaymentPage({ params }: BatchPaymentPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return notFound()
  }

  const { batchId } = params

  // Get all payments in the batch
  const payments = await db.payment.findMany({
    where: {
      batchId: batchId,
    },
    include: {
      transaction: {
        include: {
          package: true,
          reseller: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  })

  if (payments.length === 0) {
    return notFound()
  }

  return (
    <div className="container py-6">
      <BatchPaymentApproval payments={payments} />
    </div>
  )
}


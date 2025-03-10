import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResellerLayout } from "@/components/layouts/reseller-layout"
import { PaymentHistory } from "@/components/reseller/payment-history"

export default async function ResellerPaymentsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "RESELLER") {
    redirect("/")
  }

  const payments = await db.payment.findMany({
    where: {
      resellerId: session.user.id,
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
    <ResellerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Pembayaran</h1>
        <PaymentHistory payments={payments} />
      </div>
    </ResellerLayout>
  )
}


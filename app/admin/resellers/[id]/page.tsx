import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { ResellerDetail } from "@/components/admin/reseller-detail"

export default async function ResellerDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  // Fetch reseller
  const reseller = await db.user.findUnique({
    where: {
      id: params.id,
      role: "RESELLER",
    },
  })

  if (!reseller) {
    notFound()
  }

  // Fetch all transactions for this reseller with related data
  const transactions = await db.transaction.findMany({
    where: {
      resellerId: params.id,
    },
    include: {
      package: {
        include: {
          packageType: true,
        },
      },
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <ResellerDetail reseller={reseller} transactions={transactions} />
      </div>
    </AdminLayout>
  )
}


import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { ResellerForm } from "@/components/admin/reseller-form"

interface EditResellerPageProps {
  params: {
    id: string
  }
}

export default async function EditResellerPage({ params }: EditResellerPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const reseller = await db.user.findUnique({
    where: {
      id: params.id,
      role: "RESELLER",
    },
  })

  if (!reseller) {
    notFound()
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Reseller</h1>
        <ResellerForm reseller={reseller} />
      </div>
    </AdminLayout>
  )
}


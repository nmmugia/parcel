import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { ResellerForm } from "@/components/admin/reseller-form"

export default async function CreateResellerPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Reseller</h1>
        <ResellerForm />
      </div>
    </AdminLayout>
  )
}


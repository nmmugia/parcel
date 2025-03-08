import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { PackageTypeForm } from "@/components/admin/package-type-form"

export default async function CreatePackageTypePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Jenis Paket</h1>
        <PackageTypeForm />
      </div>
    </AdminLayout>
  )
}


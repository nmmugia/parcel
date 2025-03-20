import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { PackageForm } from "@/components/admin/package-form"

export default async function CreatePackagePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const packageTypes = await db.packageType.findMany({
    orderBy: {
      name: "asc",
    },
  })

  if (packageTypes.length === 0) {
    redirect("/admin/package-types")
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Paket</h1>
        <PackageForm packageTypes={packageTypes} />
      </div>
    </AdminLayout>
  )
}


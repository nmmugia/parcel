import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { PackageTypeForm } from "@/components/admin/package-type-form"

interface EditPackageTypePageProps {
  params: {
    id: string
  }
}

export default async function EditPackageTypePage({ params }: EditPackageTypePageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const packageType = await db.packageType.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!packageType) {
    notFound()
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Jenis Paket</h1>
        <PackageTypeForm packageType={packageType} />
      </div>
    </AdminLayout>
  )
}


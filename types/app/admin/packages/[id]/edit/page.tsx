import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { PackageForm } from "@/components/admin/package-form"

interface EditPackagePageProps {
  params: {
    id: string
  }
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const packageData = await db.package.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!packageData) {
    notFound()
  }

  const packageTypes = await db.packageType.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Paket</h1>
        <PackageForm packageTypes={packageTypes} packageData={packageData} />
      </div>
    </AdminLayout>
  )
}


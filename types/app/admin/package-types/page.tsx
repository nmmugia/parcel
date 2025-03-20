import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { PackageTypeList } from "@/components/admin/package-type-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function PackageTypesPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const packageTypes = await db.packageType.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Jenis Paket</h1>
          <Link href="/admin/package-types/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Jenis Paket
            </Button>
          </Link>
        </div>

        <PackageTypeList packageTypes={packageTypes} />
      </div>
    </AdminLayout>
  )
}


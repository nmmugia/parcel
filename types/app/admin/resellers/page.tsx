import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { ResellerList } from "@/components/admin/reseller-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ResellersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const resellers = await db.user.findMany({
    where: {
      role: "RESELLER",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Reseller</h1>
          <Link href="/admin/resellers/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Reseller
            </Button>
          </Link>
        </div>

        <ResellerList resellers={resellers} />
      </div>
    </AdminLayout>
  )
}


import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResellerLayout } from "@/components/layouts/reseller-layout"
import { PackageCatalog } from "@/components/reseller/package-catalog"

export default async function ResellerPackagesPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "RESELLER") {
    redirect("/")
  }

  const packages = await db.package.findMany({
    where: {
      isActive: true,
    },
    include: {
      packageType: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  const packageTypes = await db.packageType.findMany({
    where: {
      packages: {
        some: {
          isActive: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <ResellerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Katalog Paket</h1>
        <PackageCatalog packages={packages} packageTypes={packageTypes} />
      </div>
    </ResellerLayout>
  )
}


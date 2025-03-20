import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResellerLayout } from "@/components/layouts/reseller-layout"
import { PackageDetail } from "@/components/reseller/package-detail"

interface PackageDetailPageProps {
  params: {
    id: string
  }
}

export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "RESELLER") {
    redirect("/")
  }

  const packageData = await db.package.findUnique({
    where: {
      id: params.id,
      isActive: true,
    },
    include: {
      packageType: true,
    },
  })

  if (!packageData) {
    notFound()
  }

  return (
    <ResellerLayout>
      <div className="p-6">
        <PackageDetail packageData={packageData} resellerId={session.user.id} />
      </div>
    </ResellerLayout>
  )
}


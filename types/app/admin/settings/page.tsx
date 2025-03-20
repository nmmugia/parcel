import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { BonusSettingsForm } from "@/components/admin/bonus-settings-form"

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  // Ambil pengaturan bonus
  const settings = await db.setting.findFirst({
    where: {
      key: "bonus_rates",
    },
  })

  let bonusRates = {
    resellerBonusRate: 0.05, // Default 5%
    adminBonusRate: 0.05, // Default 5%
  }

  if (settings && settings.value) {
    try {
      bonusRates = JSON.parse(settings.value)
    } catch (error) {
      console.error("Error parsing bonus rates:", error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>
        <BonusSettingsForm initialValues={bonusRates} />
      </div>
    </AdminLayout>
  )
}


import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { ChangePasswordForm } from "@/components/change-password-form"

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Profil Admin</h1>
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Informasi Akun</h2>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-muted-foreground">Nama:</div>
                <div>{session.user.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-muted-foreground">Email:</div>
                <div>{session.user.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-muted-foreground">Role:</div>
                <div>Admin</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}


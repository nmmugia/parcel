import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    if (session.user.role === "ADMIN") {
      redirect("/admin/dashboard")
    } else if (session.user.role === "RESELLER") {
      redirect("/reseller/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sistem Manajemen Paket</CardTitle>
          <CardDescription>Masuk untuk mengakses sistem manajemen paket dan reseller</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}


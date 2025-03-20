import type React from "react"
import { ResellerSidebar } from "@/components/reseller/reseller-sidebar"
import { ResellerHeader } from "@/components/reseller/reseller-header"

export function ResellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <ResellerSidebar />
      <div className="flex flex-col flex-1">
        <ResellerHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}


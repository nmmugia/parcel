"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingCart, CreditCard, FileText } from "lucide-react"

export function ResellerSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768)
    }

    const handleToggle = () => {
      setIsOpen(!isOpen)
    }

    // Set initial state
    handleResize()

    // Add event listeners
    window.addEventListener("resize", handleResize)
    document.addEventListener("toggle-sidebar", handleToggle)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("toggle-sidebar", handleToggle)
    }
  }, [isOpen])

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform md:static",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/reseller/dashboard" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Reseller Panel</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-6 px-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/reseller/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/reseller/dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/reseller/packages"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/reseller/packages" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <Package className="h-4 w-4" />
              Paket
            </Link>
          </li>
          <li>
            <Link
              href="/reseller/transactions"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/reseller/transactions" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              Transaksi
            </Link>
          </li>
          <li>
            <Link
              href="/reseller/payments"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/reseller/payments" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <CreditCard className="h-4 w-4" />
              Pembayaran
            </Link>
          </li>
          <li>
            <Link
              href="/reseller/reports"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/reseller/reports" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <FileText className="h-4 w-4" />
              Laporan
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}


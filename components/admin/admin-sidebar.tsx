"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Package, ShoppingCart, CreditCard, Home, Users, Settings, BarChart, Menu, X, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

interface SidebarProps {
  className?: string
}

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, isOpen])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    }
  }, [pathname, isMobile])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transition-transform duration-300 ease-in-out transform md:translate-x-0 md:static md:z-0",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "translate-x-0",
          className,
        )}
      >
        <div className="flex h-14 items-center px-4 border-b">
          <Link href="/admin/dashboard" className="flex items-center font-semibold text-lg">
            <Package className="mr-2 h-5 w-5" />
            <span>Admin Panel</span>
          </Link>

          {/* Close button on mobile */}
          {isMobile && isOpen && (
            <Button variant="ghost" size="icon" className="ml-auto" onClick={closeSidebar} aria-label="Close Menu">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <div className="px-3 py-2">
            <nav className="flex flex-col gap-1">
              <Link
                href="/admin/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                  pathname === "/admin/dashboard" && "bg-muted",
                )}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/package-types"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                  pathname.startsWith("/admin/package-types") && "bg-muted",
                )}
              >
                <Package className="h-4 w-4" />
                <span>Jenis Paket</span>
              </Link>
              <Link
                href="/admin/packages"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                  pathname.startsWith("/admin/packages") && "bg-muted",
                )}
              >
                <Package className="h-4 w-4" />
                <span>Paket</span>
              </Link>
              <Link
                href="/admin/resellers"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                  pathname.startsWith("/admin/resellers") && "bg-muted",
                )}
              >
                <Users className="h-4 w-4" />
                <span>Reseller</span>
              </Link>
              <Link
                href="/admin/transactions"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                  pathname.startsWith("/admin/transactions") && "bg-muted",
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Transaksi</span>
              </Link>
              <Link
                href="/admin/payments"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                  pathname.startsWith("/admin/payments") && "bg-muted",
                )}
              >
                <CreditCard className="h-4 w-4" />
                <span>Pembayaran</span>
              </Link>
              <Link
                href="/admin/reports"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                  pathname.startsWith("/admin/reports") && "bg-muted",
                )}
              >
                <BarChart className="h-4 w-4" />
                <span>Laporan</span>
              </Link>
              <Link
                href="/admin/settings"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                  pathname.startsWith("/admin/settings") && "bg-muted",
                )}
              >
                <Settings className="h-4 w-4" />
                <span>Pengaturan</span>
              </Link>
            </nav>
          </div>
          <div className="absolute bottom-4 left-0 right-0 px-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}


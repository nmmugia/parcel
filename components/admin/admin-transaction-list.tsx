"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { Transaction, Payment, Package, PackageType, User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatDate } from "@/lib/utils"
import { IconDisplay } from "@/components/icon-display"
import { ShoppingCart, Eye, Search } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import { usePathname } from "next/navigation"

interface TransactionWithRelations extends Transaction {
  package: Package & {
    packageType: PackageType
  }
  reseller: Pick<User, "id" | "name" | "email">
  payments: Payment[]
}

interface AdminTransactionListProps {
  transactions: TransactionWithRelations[]
  totalCount: number
  currentPage: number
  pageSize: number
}

export function AdminTransactionList({ transactions, totalCount, currentPage, pageSize }: AdminTransactionListProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    // Filter berdasarkan tab
    if (activeTab !== "all") {
      filtered = filtered.filter((transaction) => transaction.status === activeTab)
    }

    // Filter berdasarkan pencarian
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (transaction) =>
          transaction.customerName.toLowerCase().includes(query) ||
          // transaction.customerPhone.toLowerCase().includes(query) ||
          transaction.package.name.toLowerCase().includes(query) ||
          transaction.reseller.name.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [transactions, activeTab, searchQuery])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default">Aktif</Badge>
      case "COMPLETED":
        return <Badge variant="secondary">Selesai</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Dibatalkan</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatus = (payments: Payment[]) => {
    const pendingPayments = payments.filter((payment) => payment.status === "WAITING_FOR_APPROVAL")
    const approvedPayments = payments.filter((payment) => payment.status === "APPROVED")
    const rejectedPayments = payments.filter((payment) => payment.status === "REJECTED")

    return {
      pendingCount: pendingPayments.length,
      approvedCount: approvedPayments.length,
      rejectedCount: rejectedPayments.length,
      totalCount: payments.length,
    }
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-center">Belum ada transaksi</p>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Transaksi akan muncul setelah reseller membuat transaksi
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari transaksi..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="ACTIVE">Aktif</TabsTrigger>
              <TabsTrigger value="COMPLETED">Selesai</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm md:inline-flex">
            Total: {totalCount} transaksi
          </Badge>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center">Tidak ada transaksi</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Tidak ada transaksi yang sesuai dengan filter
            </p>
          </CardContent>
        </Card>
      ) : (
        
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTransactions.map((transaction) => {
              const paymentStatus = getPaymentStatus(transaction.payments)

              return (
                <Card key={transaction.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconDisplay icon={transaction.package.packageType.icon} className="h-5 w-5" />
                        <CardTitle className="text-lg">{transaction.package.name}</CardTitle>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <CardDescription className="mt-2">Pelanggan: {transaction.customerName}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reseller:</span>
                        <span className="font-medium">{transaction.reseller.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tanggal Transaksi:</span>
                        <span className="font-medium">{formatDate(transaction.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Jumlah Minggu:</span>
                        <span className="font-medium">{transaction.tenorWeeks} Minggu</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status Pembayaran:</span>
                        <span className="font-medium">
                          {paymentStatus.approvedCount}/{paymentStatus.totalCount} pembayaran
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Link href={`/admin/transactions/${transaction.id}`}>
                      <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
          <Pagination totalItems={totalCount} currentPage={currentPage} pageSize={pageSize} baseUrl={pathname} />
        </>
      )}
    </div>
  )
}


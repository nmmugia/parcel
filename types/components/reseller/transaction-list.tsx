"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { Transaction, Payment, Package, PackageType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { IconDisplay } from "@/components/icon-display"
import { ShoppingCart, Eye } from "lucide-react"

interface TransactionWithRelations extends Transaction {
  package: Package & {
    packageType: PackageType
  }
  payments: Payment[]
}

interface TransactionListProps {
  transactions: TransactionWithRelations[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredTransactions = useMemo(() => {
    if (activeTab === "all") {
      return transactions
    }
    return transactions.filter((transaction) => transaction.status === activeTab)
  }, [transactions, activeTab])

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
    const pendingPayments = payments.filter((payment) => payment.status === "WAITING_FOR_PAYMENT")
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
          <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
            Mulai buat transaksi dengan memilih paket
          </p>
          <Link href="/reseller/packages">
            <Button>Lihat Katalog Paket</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="ACTIVE">Aktif</TabsTrigger>
          <TabsTrigger value="COMPLETED">Selesai</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center">Tidak ada transaksi</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Tidak ada transaksi dengan status yang dipilih
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
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
                      <span className="text-muted-foreground">Tanggal Transaksi:</span>
                      <span className="font-medium">{formatDate(transaction.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pembayaran per Minggu:</span>
                      <span className="font-medium">{formatCurrency(transaction.weeklyAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jumlah Minggu:</span>
                      <span className="font-medium">{transaction.tenorWeeks} Minggu</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status Pembayaran:</span>
                      <span className="font-medium">
                        {paymentStatus.approvedCount}/{paymentStatus.totalCount} minggu
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Link href={`/reseller/transactions/${transaction.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}


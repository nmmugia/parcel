"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { Transaction, Payment, Package, PackageType, User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatDate } from "@/lib/utils"
import { IconDisplay } from "@/components/icon-display"
import { Eye, Search, UserIcon, Phone, ArrowLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface TransactionWithRelations extends Transaction {
  package: Package & {
    packageType: PackageType
  }
  payments: Payment[]
}

interface ResellerDetailProps {
  reseller: User
  transactions: TransactionWithRelations[]
}

export function ResellerDetail({ reseller, transactions }: ResellerDetailProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Group transactions by customer
  const customerTransactions = useMemo(() => {
    // Filter transactions based on search query
    const filteredTransactions = searchQuery
      ? transactions.filter(
          (transaction) =>
            transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.package.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : transactions

    // Group by customer
    const grouped = filteredTransactions.reduce<Record<string, TransactionWithRelations[]>>((acc, transaction) => {
      const key = `${transaction.customerName}-${transaction.customerPhone}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(transaction)
      return acc
    }, {})

    // Convert to array and sort by customer name
    return Object.entries(grouped)
      .map(([key, transactions]) => ({
        key,
        customerName: transactions[0].customerName,
        customerPhone: transactions[0].customerPhone,
        transactions: transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      }))
      .sort((a, b) => a.customerName.localeCompare(b.customerName))
  }, [transactions, searchQuery])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default">Aktif</Badge>
      case "COMPLETED":
        return <Badge variant="success">Selesai</Badge>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/resellers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detail Reseller: {reseller.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Reseller</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nama</p>
              <p>{reseller.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{reseller.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Terdaftar Pada</p>
              <p>{formatDate(reseller.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Jumlah Pelanggan</p>
              <p>{customerTransactions.length} pelanggan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari pelanggan atau transaksi..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {customerTransactions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-center">Tidak ada pelanggan</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                {searchQuery
                  ? "Tidak ada pelanggan yang sesuai dengan pencarian"
                  : "Reseller ini belum memiliki pelanggan"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {customerTransactions.map((customer) => (
              <Card key={customer.key} className="overflow-hidden">
                <AccordionItem value={customer.key} className="border-none">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex flex-col items-start text-left">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{customer.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        {customer.customerPhone && <>
                          <Phone className="h-3 w-3" />
                          <span>{customer.customerPhone}</span>
                          <span className="mx-1">•</span>
                        </>}
                        <span>{customer.transactions.length} transaksi</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 pb-6 space-y-4">
                      {customer.transactions.map((transaction) => {
                        const paymentStatus = getPaymentStatus(transaction.payments)

                        return (
                          <Card key={transaction.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <IconDisplay icon={transaction.package.packageType.icon} className="h-5 w-5" />
                                  <CardTitle className="text-lg">{transaction.package.name}</CardTitle>
                                </div>
                                {getStatusBadge(transaction.status)}
                              </div>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Tanggal Transaksi:</span>
                                  <span className="font-medium">{formatDate(transaction.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status Pembayaran:</span>
                                  <span className="font-medium">
                                    {paymentStatus.approvedCount}/{paymentStatus.totalCount} Pembayaran
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
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}


"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { Payment, Transaction, Package } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CreditCard, Check, X, Clock, Eye } from "lucide-react"
// Import the filter component
import { PaymentFilter } from "@/components/reseller/payment-filter"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface PaymentWithRelations extends Payment {
  transaction: Transaction & {
    package: Package
  }
}

interface PaymentHistoryProps {
  payments: PaymentWithRelations[]
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const [activeTab, setActiveTab] = useState("all")

  // Add filter state
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "dueDate",
    sortOrder: "asc" as "asc" | "desc",
    groupBy: "none",
  })

  // Update the filteredPayments logic to use the filters
  const filteredPayments = useMemo(() => {
    let filtered = payments

    // Filter berdasarkan tab/status
    if (activeTab !== "all") {
      filtered = filtered.filter((payment) => payment.status === activeTab)
    }

    // Sort payments
    filtered = [...filtered].sort((a, b) => {
      if (filters.sortBy === "dueDate") {
        return filters.sortOrder === "asc"
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      } else if (filters.sortBy === "paidDate") {
        // Handle null paidDate
        if (!a.paidDate) return filters.sortOrder === "asc" ? 1 : -1
        if (!b.paidDate) return filters.sortOrder === "asc" ? -1 : 1

        return filters.sortOrder === "asc"
          ? new Date(a.paidDate).getTime() - new Date(b.paidDate).getTime()
          : new Date(b.paidDate).getTime() - new Date(a.paidDate).getTime()
      } else if (filters.sortBy === "amount") {
        return filters.sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
      }
      return 0
    })

    return filtered
  }, [payments, activeTab, filters])

  // Function to group payments
  const groupedPayments = useMemo(() => {
    if (filters.groupBy === "none") {
      return { "Semua Pembayaran": filteredPayments }
    }

    const groups: Record<string, PaymentWithRelations[]> = {}

    filteredPayments.forEach((payment) => {
      let groupKey = ""

      if (filters.groupBy === "month") {
        const date = new Date(payment.dueDate)
        groupKey = format(date, "MMMM yyyy", { locale: id })
      } else if (filters.groupBy === "status") {
        switch (payment.status) {
          case "WAITING_FOR_PAYMENT":
            groupKey = "Menunggu Pembayaran"
            break
          case "WAITING_FOR_APPROVAL":
            groupKey = "Menunggu Persetujuan"
            break
          case "APPROVED":
            groupKey = "Disetujui"
            break
          case "REJECTED":
            groupKey = "Ditolak"
            break
          default:
            groupKey = "Lainnya"
        }
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }

      groups[groupKey].push(payment)
    })

    return groups
  }, [filteredPayments, filters.groupBy])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING_FOR_PAYMENT":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Menunggu Pembayaran
          </Badge>
        )
      case "WAITING_FOR_APPROVAL":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Menunggu Persetujuan
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            Disetujui
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            Ditolak
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-center">Belum ada pembayaran</p>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Pembayaran akan muncul setelah Anda membuat transaksi
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PaymentFilter onFilterChange={setFilters} />

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="WAITING_FOR_PAYMENT">Menunggu Pembayaran</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="WAITING_FOR_APPROVAL">Menunggu Persetujuan</TabsTrigger>
            <TabsTrigger value="APPROVED">Disetujui</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {Object.keys(groupedPayments).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center">Tidak ada pembayaran</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Tidak ada pembayaran dengan status yang dipilih
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedPayments).map(([groupName, payments]) => (
            <div key={groupName} className="space-y-4">
              {filters.groupBy !== "none" && <h3 className="text-lg font-semibold">{groupName}</h3>}

              <div className="space-y-4">
                {payments.map((payment) => (
                  <Card key={payment.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{payment.transaction.package.name}</CardTitle>
                        {getStatusBadge(payment.status)}
                      </div>
                      <CardDescription>Pelanggan: {payment.transaction.customerName}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Jumlah:</span>
                          <span className="font-medium">{formatCurrency(payment.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Batas Pembayaran:</span>
                          <span className="font-medium">{formatDate(payment.dueDate)}</span>
                        </div>
                        {payment.paidDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tanggal Bayar:</span>
                            <span className="font-medium">{formatDate(payment.paidDate)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Metode Pembayaran:</span>
                          <span className="font-medium">
                            {payment.paymentMethod === "TRANSFER" ? "Transfer Bank" : "Tunai"}
                          </span>
                        </div>
                        {payment.resellerBonus && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Bonus Reseller:</span>
                            <span className="font-medium">{formatCurrency(payment.resellerBonus)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bukti Pembayaran:</span>
                          <span className="font-medium">
                            {payment.proofImageUrl ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(payment.proofImageUrl!, "_blank")}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat
                              </Button>
                            ) : payment.paymentMethod === "CASH" ? (
                              "Pembayaran Tunai"
                            ) : (
                              "Belum diunggah"
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <Link href={`/reseller/transactions/${payment.transaction.id}`}>
                        <Button variant="outline" className="w-full">
                          Lihat Transaksi
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


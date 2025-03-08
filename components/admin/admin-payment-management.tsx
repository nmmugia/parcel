"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { Payment, Transaction, Package, User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CreditCard, Eye, Search, Check, X, Clock } from "lucide-react"

interface TransactionWithRelations extends Transaction {
  package: Package
  reseller: Pick<User, "id" | "name" | "email">
}

interface PaymentWithRelations extends Payment {
  transaction: TransactionWithRelations
}

interface AdminPaymentManagementProps {
  payments: PaymentWithRelations[]
}

export function AdminPaymentManagement({ payments }: AdminPaymentManagementProps) {
  const [activeTab, setActiveTab] = useState("PENDING")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPayments = useMemo(() => {
    let filtered = payments

    // Filter berdasarkan tab
    if (activeTab !== "all") {
      filtered = filtered.filter((payment) => payment.status === activeTab)
    }

    // Filter berdasarkan pencarian
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (payment) =>
          payment.transaction.customerName.toLowerCase().includes(query) ||
          payment.transaction.package.name.toLowerCase().includes(query) ||
          payment.transaction.reseller.name.toLowerCase().includes(query),
      )
    }

    // Untuk tab PENDING, hanya tampilkan yang sudah ada bukti pembayaran
    if (activeTab === "PENDING") {
      filtered = filtered.filter((payment) => payment.proofImageUrl !== null)
    }

    return filtered
  }, [payments, activeTab, searchQuery])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Menunggu
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="success" className="flex items-center gap-1">
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
            Pembayaran akan muncul setelah reseller membuat transaksi
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
            placeholder="Cari pembayaran..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="PENDING" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="PENDING">Menunggu</TabsTrigger>
            <TabsTrigger value="APPROVED">Disetujui</TabsTrigger>
            <TabsTrigger value="REJECTED">Ditolak</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center">Tidak ada pembayaran</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Tidak ada pembayaran yang sesuai dengan filter
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{payment.transaction.package.name}</CardTitle>
                  {getStatusBadge(payment.status)}
                </div>
                <CardDescription className="mt-2">Pelanggan: {payment.transaction.customerName}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reseller:</span>
                    <span className="font-medium">{payment.transaction.reseller.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah:</span>
                    <span className="font-medium">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jatuh Tempo:</span>
                    <span className="font-medium">{formatDate(payment.dueDate)}</span>
                  </div>
                  {payment.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal Bayar:</span>
                      <span className="font-medium">{formatDate(payment.paidDate)}</span>
                    </div>
                  )}
                  {payment.resellerBonus && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bonus Reseller:</span>
                      <span className="font-medium">{formatCurrency(payment.resellerBonus)}</span>
                    </div>
                  )}
                  {payment.adminBonus && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bonus Admin:</span>
                      <span className="font-medium">{formatCurrency(payment.adminBonus)}</span>
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
                      ) : (
                        "Belum diunggah"
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                <Link href={`/admin/payments/${payment.id}`}>
                  <Button className="w-full">
                    {payment.status === "PENDING" && payment.proofImageUrl ? "Proses Pembayaran" : "Lihat Detail"}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


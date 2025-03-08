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

  const filteredPayments = useMemo(() => {
    if (activeTab === "all") {
      return payments
    }
    return payments.filter((payment) => payment.status === activeTab)
  }, [payments, activeTab])

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
            Pembayaran akan muncul setelah Anda membuat transaksi
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="PENDING">Menunggu</TabsTrigger>
          <TabsTrigger value="APPROVED">Disetujui</TabsTrigger>
          <TabsTrigger value="REJECTED">Ditolak</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredPayments.length === 0 ? (
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
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
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
                <Link href={`/reseller/transactions/${payment.transactionId}`}>
                  <Button variant="outline" className="w-full">
                    Lihat Transaksi
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


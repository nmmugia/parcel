"use client"
import { useRouter } from "next/navigation"
import type { Transaction, Payment, Package, PackageType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils"
import { IconDisplay } from "@/components/icon-display"
import { ArrowLeft, CreditCard } from "lucide-react"
import { PaymentList } from "@/components/reseller/payment-list"

interface TransactionWithRelations extends Transaction {
  package: Package & {
    packageType: PackageType
  }
  payments: Payment[]
}

interface TransactionDetailProps {
  transaction: TransactionWithRelations
}

export function TransactionDetail({ transaction }: TransactionDetailProps) {
  const router = useRouter()

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detail Transaksi</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconDisplay icon={transaction.package.packageType.icon} className="h-5 w-5" />
                <CardTitle>{transaction.package.name}</CardTitle>
              </div>
              {getStatusBadge(transaction.status)}
            </div>
            <CardDescription className="mt-2">ID Transaksi: {transaction.id}</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Informasi Paket</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jenis Paket:</span>
                    <span className="font-medium">{transaction.package.packageType.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga Total:</span>
                    <span className="font-medium">{formatCurrency(transaction.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tenor:</span>
                    <span className="font-medium">{transaction.tenorMonths} bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cicilan per Bulan:</span>
                    <span className="font-medium">{formatCurrency(transaction.monthlyAmount)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Informasi Pelanggan</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama:</span>
                    <span className="font-medium">{transaction.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telepon:</span>
                    <span className="font-medium">{transaction.customerPhone}</span>
                  </div>
                  {transaction.customerAddress && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alamat:</span>
                      <span className="font-medium text-right">{transaction.customerAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Informasi Transaksi</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tanggal Transaksi:</span>
                    <span className="font-medium">{formatDate(transaction.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{getStatusBadge(transaction.status)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pembayaran
            </CardTitle>
            <CardDescription>Daftar cicilan pembayaran untuk transaksi ini</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentList payments={transaction.payments} transactionId={transaction.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


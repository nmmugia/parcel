"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Transaction, Payment, Package, PackageType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils"
import { IconDisplay } from "@/components/icon-display"
import { ArrowLeft, CreditCard, Upload } from "lucide-react"
import { PaymentWeeksForm } from "@/components/reseller/payment-weeks-form"
import { PaymentVisualGrid } from "@/components/reseller/payment-visual-grid"

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
  const [showPaymentForm, setShowPaymentForm] = useState(false)

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

  // Check if there are any unpaid payments
  const hasUnpaidPayments = transaction.payments.some(
    (p) => p.status === "WAITING_FOR_PAYMENT" || p.status === "REJECTED",
  )

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
                    <span className="text-muted-foreground">Jumlah Minggu:</span>
                    <span className="font-medium">{transaction.tenorWeeks} Minggu</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pembayaran per Minggu:</span>
                    <span className="font-medium">{formatCurrency(transaction.weeklyAmount)}</span>
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
                  {/* <div className="flex justify-between">
                    <span className="text-muted-foreground">Telepon:</span>
                    <span className="font-medium">{transaction.customerPhone}</span>
                  </div>
                  {transaction.customerAddress && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alamat:</span>
                      <span className="font-medium text-right">{transaction.customerAddress}</span>
                    </div>
                  )} */}
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
                  { transaction.package.packageType.isBonusEligible &&
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Berhak Atas Bonus:</span>
                    <span className="font-medium">
                      {transaction.isBonusEligible ? (
                        <Badge variant="success">Ya</Badge>
                      ) : (
                        <Badge variant="destructive">Tidak (Terdapat Keterlambatan)</Badge>
                      )}
                    </span>
                  </div>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pembayaran
              </CardTitle>
              {hasUnpaidPayments && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowPaymentForm(true)}
                  className="flex items-center gap-1"
                >
                  <Upload className="h-4 w-4" />
                  Bayar Cicilan
                </Button>
              )}
            </div>
            <CardDescription>Status pembayaran cicilan untuk transaksi ini</CardDescription>
          </CardHeader>
          <CardContent>
            {showPaymentForm ? (
              <PaymentWeeksForm
                payments={transaction.payments}
                transactionId={transaction.id}
                onClose={() => setShowPaymentForm(false)}
                onSuccess={() => {
                  setShowPaymentForm(false)
                  // Refresh data
                  window.location.reload()
                }}
              />
            ) : (
              <div className="space-y-6">
                <PaymentVisualGrid payments={transaction.payments} onSelectPayment={() => {}} selectedCount={0} />

                {/* Payment summary */}
                <div className="space-y-2 mt-6">
                  <h3 className="text-sm font-medium">Ringkasan Pembayaran</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Total Cicilan</div>
                      <div className="font-medium">{transaction.payments.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Sudah Dibayar</div>
                      <div className="font-medium">
                        {transaction.payments.filter((p) => p.status === "APPROVED").length}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Menunggu Persetujuan</div>
                      <div className="font-medium">
                        {transaction.payments.filter((p) => p.status === "WAITING_FOR_APPROVAL").length}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Belum Dibayar</div>
                      <div className="font-medium">
                        {transaction.payments.filter((p) => p.status === "WAITING_FOR_PAYMENT").length}
                      </div>
                    </div>
                  </div>
                </div>

                {!hasUnpaidPayments && (
                  <div className="rounded-lg bg-muted p-4 text-center text-sm">
                    <p>Semua pembayaran telah diunggah atau diproses.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import type { Payment } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Upload, Check, X, Clock } from "lucide-react"
import { PaymentUploadForm } from "@/components/reseller/payment-upload-form"

interface PaymentListProps {
  payments: Payment[]
  transactionId: string
}

export function PaymentList({ payments, transactionId }: PaymentListProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

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

  const isPendingPaymentAvailable = payments.some((payment) => payment.status === "PENDING" && !payment.proofImageUrl)

  if (payments.length === 0) {
    return <p className="text-center text-muted-foreground">Tidak ada data pembayaran</p>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="flex flex-col gap-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Cicilan {formatDate(payment.dueDate)}</div>
              {getStatusBadge(payment.status)}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Jumlah:</span>
              <span>{formatCurrency(payment.amount)}</span>
            </div>
            {payment.paidDate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tanggal Bayar:</span>
                <span>{formatDate(payment.paidDate)}</span>
              </div>
            )}
            {payment.resellerBonus && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bonus Reseller:</span>
                <span>{formatCurrency(payment.resellerBonus)}</span>
              </div>
            )}
            <div className="mt-2">
              {payment.proofImageUrl ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bukti pembayaran telah diunggah</span>
                  <Button variant="outline" size="sm" onClick={() => window.open(payment.proofImageUrl!, "_blank")}>
                    Lihat Bukti
                  </Button>
                </div>
              ) : payment.status === "PENDING" ? (
                <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedPayment(payment)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Unggah Bukti Pembayaran
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">Tidak ada bukti pembayaran</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPayment && (
        <PaymentUploadForm
          payment={selectedPayment}
          transactionId={transactionId}
          onClose={() => setSelectedPayment(null)}
          onSuccess={() => {
            setSelectedPayment(null)
            // Refresh data
            window.location.reload()
          }}
        />
      )}

      {!isPendingPaymentAvailable && !selectedPayment && (
        <div className="rounded-lg bg-muted p-4 text-center text-sm">
          <p>Semua pembayaran telah diunggah atau diproses.</p>
        </div>
      )}
    </div>
  )
}


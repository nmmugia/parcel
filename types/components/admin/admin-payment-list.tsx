"use client"
import Link from "next/link"
import type { Payment } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye, Check, X, Clock } from "lucide-react"

interface AdminPaymentListProps {
  payments: Payment[]
}

export function AdminPaymentList({ payments }: AdminPaymentListProps) {
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

  const getMessage = (status:string) => {
    switch (status) {
    case "WAITING_FOR_APPROVAL":
      return "Pembayaran Menggunakan Cash"
    default:
      return "Belum ada bukti pembayaran"
    }
  }

  if (payments.length === 0) {
    return <p className="text-center text-muted-foreground">Tidak ada data pembayaran</p>
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Batas Tanggal Pembayaran {formatDate(payment.dueDate)}</div>
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
          <div className="mt-2">
            {payment.proofImageUrl ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bukti pembayaran telah diunggah</span>
                <Button variant="outline" size="sm" onClick={() => window.open(payment.proofImageUrl!, "_blank")}>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Bukti
                </Button>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">{getMessage(payment.status)}</span>
            )}
          </div>
          {payment.status === "WAITING_FOR_APPROVAL" && (
            <div className="mt-2">
              <Link href={`/admin/payments/${payment.id}`}>
                <Button size="sm" className="w-full">
                  Proses Pembayaran
                </Button>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


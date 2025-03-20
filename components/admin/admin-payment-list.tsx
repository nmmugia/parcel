"use client"

import Link from "next/link"
import { useMemo } from "react"
import type { Payment } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye, Check, X, Clock, Layers } from "lucide-react"

interface AdminPaymentListProps {
  payments: Payment[]
}

interface BatchGroup {
  batchId: string
  payments: Payment[]
  totalAmount: number
  proofImageUrl: string | null
  status: string
}

export function AdminPaymentList({ payments }: AdminPaymentListProps) {
  // Group payments by batchId
  const { batchPayments, singlePayments } = useMemo(() => {
    const batches = new Map<string, Payment[]>()
    const singles: Payment[] = []

    payments.forEach((payment) => {
      if (payment.batchId) {
        if (!batches.has(payment.batchId)) {
          batches.set(payment.batchId, [])
        }
        batches.get(payment.batchId)!.push(payment)
      } else {
        singles.push(payment)
      }
    })

    // Convert batches map to array of BatchGroup
    const batchGroups: BatchGroup[] = Array.from(batches.entries()).map(([batchId, payments]) => ({
      batchId,
      payments,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      proofImageUrl: payments[0].proofImageUrl, // All payments in batch share same proof
      status: payments[0].status, // All payments in batch should have same status
    }))

    return {
      batchPayments: batchGroups,
      singlePayments: singles,
    }
  }, [payments])

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
    return <p className="text-center text-muted-foreground">Tidak ada data pembayaran</p>
  }

  return (
    <div className="space-y-8">
      {/* Batch Payments */}
      {batchPayments.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Pembayaran Sekaligus</h3>
          {batchPayments.map((batch) => (
            <Card key={batch.batchId} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span className="font-medium">Pembayaran {batch.payments.length} Minggu</span>
                </div>
                {getStatusBadge(batch.status)}
              </div>

              {/* Batch Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Pembayaran:</span>
                  <span className="font-medium">{formatCurrency(batch.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Periode:</span>
                  <span>
                    {formatDate(batch.payments[0].dueDate)} -{" "}
                    {formatDate(batch.payments[batch.payments.length - 1].dueDate)}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-2 border-t pt-4">
                {batch.payments.map((payment) => (
                  <div key={payment.id} className="text-sm flex justify-between items-center py-1">
                    <span>Cicilan {formatDate(payment.dueDate)}</span>
                    <span>{formatCurrency(payment.amount)}</span>
                  </div>
                ))}
              </div>

              {/* Proof and Action */}
              <div className="mt-4 space-y-4">
                {batch.proofImageUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bukti pembayaran telah diunggah</span>
                    <Button variant="outline" size="sm" onClick={() => window.open(batch.proofImageUrl!, "_blank")}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Bukti
                    </Button>
                  </div>
                )}

                {batch.status === "WAITING_FOR_APPROVAL" && (
                  <Link href={`/admin/payments/batch/${batch.batchId}`}>
                    <Button size="sm" className="w-full">
                      Proses Pembayaran Sekaligus
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Single Payments */}
      {singlePayments.length > 0 && (
        <div className="space-y-4">
          {batchPayments.length > 0 && <h3 className="font-medium">Pembayaran Tunggal</h3>}
          {singlePayments.map((payment) => (
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
              {payment.adminBonus && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bonus Admin:</span>
                  <span>{formatCurrency(payment.adminBonus)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status Pembayaran:</span>
                <span className="font-medium">
                  {payment.isLate ? (
                    <Badge variant="destructive" className="ml-2">
                      Terlambat
                    </Badge>
                  ) : payment.status === "APPROVED" ? (
                    <Badge variant="success" className="ml-2">
                      Tepat Waktu
                    </Badge>
                  ) : null}
                </span>
              </div>
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
                  <span className="text-sm text-muted-foreground">Belum ada bukti pembayaran</span>
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
      )}
    </div>
  )
}


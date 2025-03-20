"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowLeft, Check, X, Loader2 } from "lucide-react"
import { ZoomableImage } from "@/components/zoomable-image"

type PaymentWithRelations = {
  id: string
  amount: number
  status: string
  dueDate: Date
  paidDate: Date | null
  proofImageUrl: string | null
  batchId: string
  transaction: {
    id: string
    customerName: string
    package: {
      name: string
    }
    reseller: {
      name: string
      email: string
    }
  }
}

interface BatchPaymentApprovalProps {
  payments: PaymentWithRelations[]
}

export function BatchPaymentApproval({ payments }: BatchPaymentApprovalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const batchId = payments[0]?.batchId

  const handleApprove = async () => {
    try {
      setIsApproving(true)
      const response = await fetch("/api/payments/batch/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ batchId }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve payments")
      }

      toast({
        title: "Pembayaran disetujui",
        description: `${payments.length} pembayaran berhasil disetujui`,
      })

      router.refresh()
      router.push("/admin/payments")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Terjadi kesalahan saat menyetujui pembayaran",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    try {
      setIsRejecting(true)
      const response = await fetch("/api/payments/batch/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ batchId }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject payments")
      }

      toast({
        title: "Pembayaran ditolak",
        description: `${payments.length} pembayaran berhasil ditolak`,
      })

      router.refresh()
      router.push("/admin/payments")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Terjadi kesalahan saat menolak pembayaran",
      })
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">Persetujuan Pembayaran Sekaligus</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Pembayaran</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Jumlah Cicilan</h3>
              <p className="text-2xl font-bold">{payments.length} minggu</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tanggal Upload</h3>
              <p className="text-2xl font-bold">{formatDate(payments[0]?.paidDate || new Date())}</p>
            </div>
          </div>

          <Separator />

          {/* Customer & Reseller Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium">Informasi Pelanggan</h3>
              <p className="text-sm">
                <span className="text-muted-foreground">Nama:</span>{" "}
                <span className="font-medium">{payments[0]?.transaction.customerName}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Paket:</span>{" "}
                <span className="font-medium">{payments[0]?.transaction.package.name}</span>
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Informasi Reseller</h3>
              <p className="text-sm">
                <span className="text-muted-foreground">Nama:</span>{" "}
                <span className="font-medium">{payments[0]?.transaction.reseller.name}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium">{payments[0]?.transaction.reseller.email}</span>
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div>
            <h3 className="mb-4 font-medium">Detail Cicilan</h3>
            <div className="rounded-md border">
              <div className="grid grid-cols-3 gap-4 border-b bg-muted p-3 text-sm font-medium">
                <div>Tanggal Jatuh Tempo</div>
                <div>Minggu Ke</div>
                <div className="text-right">Jumlah</div>
              </div>
              <div className="divide-y">
                {payments.map((payment, index) => (
                  <div key={payment.id} className="grid grid-cols-3 gap-4 p-3 text-sm">
                    <div>{formatDate(payment.dueDate)}</div>
                    <div>Minggu {index + 1}</div>
                    <div className="text-right font-medium">{formatCurrency(payment.amount)}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 border-t bg-muted p-3">
                <div className="col-span-2 font-medium">Total</div>
                <div className="text-right font-bold">{formatCurrency(totalAmount)}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Proof of Payment */}
          {payments[0]?.proofImageUrl && (
            <div>
              <h3 className="mb-4 font-medium">Bukti Pembayaran</h3>
              <div className="overflow-hidden rounded-md border">
                <ZoomableImage
                  src={payments[0].proofImageUrl}
                  alt="Bukti Pembayaran"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={isApproving || isRejecting}>
                  {isRejecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Tolak Semua
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tolak Semua Pembayaran?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Anda akan menolak {payments.length} pembayaran sekaligus. Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground">
                    Ya, Tolak Semua
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button className="w-full" onClick={handleApprove} disabled={isApproving || isRejecting}>
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Setujui Semua
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}


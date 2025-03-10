"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Payment, Transaction, Package, User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { ArrowLeft, CheckCircle, XCircle, ImageIcon, CreditCard, Loader2 } from "lucide-react"

interface TransactionWithRelations extends Transaction {
  package: Package
  reseller: Pick<User, "id" | "name" | "email">
}

interface PaymentWithRelations extends Payment {
  transaction: TransactionWithRelations
}

interface AdminPaymentDetailProps {
  payment: PaymentWithRelations
  bonusRates: {
    resellerBonusRate: number
    adminBonusRate: number
  }
}

export function AdminPaymentDetail({ payment, bonusRates }: AdminPaymentDetailProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING_FOR_PAYMENT":
        return <Badge variant="outline">Menunggu Pembayaran</Badge>
      case "WAITING_FOR_APPROVAL":
        return <Badge variant="outline">Menunggu Persetujuan</Badge>
      case "APPROVED":
        return <Badge variant="success">Disetujui</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Ditolak</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleApprovePayment = async () => {
    setIsProcessing(true)

    try {
      // Hitung bonus
      const resellerBonus = Math.round(payment.amount * bonusRates.resellerBonusRate)
      const adminBonus = Math.round(payment.amount * bonusRates.adminBonusRate)

      const response = await fetch(`/api/payments/${payment.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resellerBonus,
          adminBonus,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menyetujui pembayaran")
      }

      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil disetujui",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyetujui pembayaran",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectPayment = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch(`/api/payments/${payment.id}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menolak pembayaran")
      }

      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil ditolak",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menolak pembayaran",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detail Pembayaran</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Informasi Pembayaran</CardTitle>
              {getStatusBadge(payment.status)}
            </div>
            <CardDescription className="mt-2">ID Pembayaran: {payment.id}</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-4">
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metode Pembayaran:</span>
                  <span className="font-medium">
                    {payment.paymentMethod === "TRANSFER" ? "Transfer Bank" : "Tunai"}
                  </span>
                </div>
                {payment.status === "APPROVED" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bonus Reseller:</span>
                      <span className="font-medium">{formatCurrency(payment.resellerBonus || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bonus Admin:</span>
                      <span className="font-medium">{formatCurrency(payment.adminBonus || 0)}</span>
                    </div>
                  </>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Informasi Transaksi</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paket:</span>
                    <span className="font-medium">{payment.transaction.package.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pelanggan:</span>
                    <span className="font-medium">{payment.transaction.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reseller:</span>
                    <span className="font-medium">{payment.transaction.reseller.name}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Perhitungan Bonus</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Persentase Bonus Reseller:</span>
                    <span className="font-medium">{(bonusRates.resellerBonusRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Persentase Bonus Admin:</span>
                    <span className="font-medium">{(bonusRates.adminBonusRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bonus Reseller (jika disetujui):</span>
                    <span className="font-medium">
                      {formatCurrency(Math.round(payment.amount * bonusRates.resellerBonusRate))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bonus Admin (jika disetujui):</span>
                    <span className="font-medium">
                      {formatCurrency(Math.round(payment.amount * bonusRates.adminBonusRate))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            {payment.status === "WAITING_FOR_APPROVAL" && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <XCircle className="mr-2 h-4 w-4" />
                      Tolak
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tolak Pembayaran</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menolak pembayaran ini? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRejectPayment} disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          "Ya, Tolak"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Setujui
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Setujui Pembayaran</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menyetujui pembayaran ini? Bonus akan dihitung secara otomatis.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleApprovePayment} disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          "Ya, Setujui"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            <Link href={`/admin/transactions/${payment.transaction.id}`}>
              <Button variant="outline">Lihat Transaksi</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Bukti Pembayaran
            </CardTitle>
            <CardDescription>Bukti pembayaran yang diunggah oleh reseller</CardDescription>
          </CardHeader>
          <CardContent>
            {payment.paymentMethod === "TRANSFER" ? (
              payment.proofImageUrl ? (
                <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                  <Image
                    src={payment.proofImageUrl || "/placeholder.svg"}
                    alt="Bukti Pembayaran"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-muted rounded-md">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Belum ada bukti pembayaran</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-48 bg-muted rounded-md">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Pembayaran tunai tanpa bukti transfer</p>
              </div>
            )}
          </CardContent>
          {payment.paymentMethod === "TRANSFER" && payment.proofImageUrl && (
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(payment.proofImageUrl!, "_blank")}
              >
                Lihat Gambar Asli
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}


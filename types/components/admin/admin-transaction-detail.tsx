"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Transaction, Payment, Package, PackageType, User } from "@prisma/client"
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
import { IconDisplay } from "@/components/icon-display"
import { ArrowLeft, CreditCard, CheckCircle, XCircle } from "lucide-react"
import { AdminPaymentList } from "@/components/admin/admin-payment-list"

interface TransactionWithRelations extends Transaction {
  package: Package & {
    packageType: PackageType
  }
  reseller: Pick<User, "id" | "name" | "email">
  payments: Payment[]
}

interface AdminTransactionDetailProps {
  transaction: TransactionWithRelations
}

export function AdminTransactionDetail({ transaction }: AdminTransactionDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default">Aktif</Badge>
      case "COMPLETED":
        return <Badge variant="secondary">Selesai</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Dibatalkan</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleUpdateStatus = async (status: string) => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat memperbarui status transaksi")
      }

      toast({
        title: "Berhasil",
        description: `Status transaksi berhasil diubah menjadi ${status === "COMPLETED" ? "Selesai" : "Dibatalkan"}`,
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat memperbarui status transaksi",
      })
    } finally {
      setIsUpdating(false)
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
                <h3 className="font-medium mb-2">Informasi Reseller</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama:</span>
                    <span className="font-medium">{transaction.reseller.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{transaction.reseller.email}</span>
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
                        <Badge variant="default">Ya</Badge>
                      ) : (
                        <Badge variant="destructive">Tidak</Badge>
                      )}
                    </span>
                  </div>
                  }
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            {transaction.status === "ACTIVE" && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <XCircle className="mr-2 h-4 w-4" />
                      Batalkan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Batalkan Transaksi</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin membatalkan transaksi ini? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleUpdateStatus("CANCELLED")} disabled={isUpdating}>
                        {isUpdating ? "Memproses..." : "Ya, Batalkan"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Selesaikan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Selesaikan Transaksi</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menyelesaikan transaksi ini? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleUpdateStatus("COMPLETED")} disabled={isUpdating}>
                        {isUpdating ? "Memproses..." : "Ya, Selesaikan"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pembayaran
            </CardTitle>
            <CardDescription>Daftar pembayaran untuk transaksi ini</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminPaymentList payments={transaction.payments} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


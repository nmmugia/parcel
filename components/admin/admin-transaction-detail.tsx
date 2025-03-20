"use client"

import { useState, useMemo } from "react"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency, formatDate } from "@/lib/utils"
import { IconDisplay } from "@/components/icon-display"
import { ArrowLeft, CreditCard, CheckCircle, XCircle, Layers, Clock, Check, X } from "lucide-react"
import { PaymentVisualGrid } from "@/components/reseller/payment-visual-grid"
import Link from "next/link"

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

// Helper function to group payments by batch and status
function groupPayments(payments: Payment[]) {
  // Group by batch
  const batchGroups = new Map<string | null, Payment[]>()

  // First, collect all batch payments
  payments.forEach((payment) => {
    if (payment.batchId) {
      if (!batchGroups.has(payment.batchId)) {
        batchGroups.set(payment.batchId, [])
      }
      batchGroups.get(payment.batchId)!.push(payment)
    }
  })

  // Then collect all non-batch payments
  const nonBatchPayments = payments.filter((p) => !p.batchId)

  // Group non-batch payments by status
  const pendingApproval = nonBatchPayments.filter((p) => p.status === "WAITING_FOR_APPROVAL")
  const approved = nonBatchPayments.filter((p) => p.status === "APPROVED")
  const waitingForPayment = nonBatchPayments.filter((p) => p.status === "WAITING_FOR_PAYMENT")
  const rejected = nonBatchPayments.filter((p) => p.status === "REJECTED")

  return {
    batches: Array.from(batchGroups.entries()).map(([batchId, payments]) => ({
      batchId,
      payments,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      status: payments[0].status,
      proofImageUrl: payments[0].proofImageUrl,
    })),
    pendingApproval,
    approved,
    waitingForPayment,
    rejected,
  }
}

export function AdminTransactionDetail({ transaction }: AdminTransactionDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Group payments for better organization
  const groupedPayments = useMemo(() => groupPayments(transaction.payments), [transaction.payments])

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
            <CardDescription>Total {transaction.payments.length} pembayaran untuk transaksi ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visual Payment Grid - Always visible */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-4">Visualisasi Status Pembayaran</h3>
              <PaymentVisualGrid payments={transaction.payments} onSelectPayment={() => {}} selectedCount={0} />
            </div>

            {/* Detailed Payment List with Accordions */}
            <Accordion type="single" collapsible className="w-full">
              {/* Batch Payments */}
              {groupedPayments.batches.length > 0 && (
                <AccordionItem value="batches">
                  <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      <span>Pembayaran Sekaligus ({groupedPayments.batches.length})</span>

                      {/* Show badge if any batch needs approval */}
                      {groupedPayments.batches.some((batch) => batch.status === "WAITING_FOR_APPROVAL") && (
                        <Badge variant="outline" className="ml-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Perlu Persetujuan
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4 mt-2">
                      {groupedPayments.batches.map((batch) => (
                        <div key={batch.batchId} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4" />
                              <span className="font-medium">Pembayaran {batch.payments.length} Minggu</span>
                            </div>
                            <Badge
                              variant={
                                batch.status === "WAITING_FOR_APPROVAL"
                                  ? "outline"
                                  : batch.status === "APPROVED"
                                    ? "success"
                                    : batch.status === "REJECTED"
                                      ? "destructive"
                                      : "outline"
                              }
                              className="flex items-center gap-1"
                            >
                              {batch.status === "WAITING_FOR_APPROVAL" && <Clock className="h-3 w-3" />}
                              {batch.status === "APPROVED" && <Check className="h-3 w-3" />}
                              {batch.status === "REJECTED" && <X className="h-3 w-3" />}
                              {batch.status === "WAITING_FOR_APPROVAL"
                                ? "Menunggu Persetujuan"
                                : batch.status === "APPROVED"
                                  ? "Disetujui"
                                  : batch.status === "REJECTED"
                                    ? "Ditolak"
                                    : batch.status}
                            </Badge>
                          </div>

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

                          {batch.proofImageUrl && (
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-sm text-muted-foreground">Bukti pembayaran telah diunggah</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(batch.proofImageUrl!, "_blank")}
                              >
                                Lihat Bukti
                              </Button>
                            </div>
                          )}

                          {batch.status === "WAITING_FOR_APPROVAL" && (
                            <div className="mt-4">
                              <Link href={`/admin/payments/batch/${batch.batchId}`}>
                                <Button size="sm" className="w-full">
                                  Proses Pembayaran Sekaligus
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Pending Approval Payments */}
              {groupedPayments.pendingApproval.length > 0 && (
                <AccordionItem value="pending">
                  <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Menunggu Persetujuan ({groupedPayments.pendingApproval.length})</span>
                      <Badge variant="outline" className="ml-2">
                        Perlu Tindakan
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4 mt-2">
                      {groupedPayments.pendingApproval.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Pembayaran {formatDate(payment.dueDate)}</div>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Menunggu Persetujuan
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
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
                          </div>

                          {payment.proofImageUrl && (
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-sm text-muted-foreground">Bukti pembayaran telah diunggah</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(payment.proofImageUrl!, "_blank")}
                              >
                                Lihat Bukti
                              </Button>
                            </div>
                          )}

                          <div className="mt-4">
                            <Link href={`/admin/payments/${payment.id}`}>
                              <Button size="sm" className="w-full">
                                Proses Pembayaran
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Approved Payments */}
              {groupedPayments.approved.length > 0 && (
                <AccordionItem value="approved">
                  <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Pembayaran Disetujui ({groupedPayments.approved.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4 mt-2">
                      {groupedPayments.approved.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Pembayaran {formatDate(payment.dueDate)}</div>
                            <Badge variant="success" className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              {payment.isLate ? "Dibayar Terlambat" : "Dibayar Tepat Waktu"}
                            </Badge>
                          </div>

                          <div className="space-y-2">
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
                          </div>

                          {payment.proofImageUrl && payment.paymentMethod === "TRANSFER" && (
                            <div className="flex items-center justify-end mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(payment.proofImageUrl!, "_blank")}
                              >
                                Lihat Bukti
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


"use client"

import { useState, useRef, useEffect } from "react"
import type { Payment } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Upload, Check, X, Clock, AlertTriangle, ChevronDown } from "lucide-react"
import { PaymentUploadForm } from "@/components/reseller/payment-upload-form"

interface PaymentListProps {
  payments: Payment[]
  transactionId: string
}

export function PaymentList({ payments, transactionId }: PaymentListProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  // Fix hydration issues by only rendering client-side content after mount
  useEffect(() => {
    setMounted(true)

    // Add scroll event listener to show/hide the button based on scroll position
    const handleScroll = () => {
      // Show button when user has scrolled down a bit
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const pageHeight = document.body.scrollHeight

      // Show button if we're not near the bottom and the page is tall enough to scroll
      setShowScrollButton(scrollY < pageHeight - viewportHeight - 200 && pageHeight > viewportHeight + 300)
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToBottom = (payment: Payment) => {
    setSelectedPayment(payment);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToB = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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

  const canUploadPayment = (payment: Payment) => {
    return payment.status === "WAITING_FOR_PAYMENT" || payment.status === "REJECTED"
  }

  const isPendingPaymentAvailable = payments.some((payment) => canUploadPayment(payment))

  if (!mounted) {
    return null
  }

  if (payments.length === 0) {
    return <p className="text-center text-muted-foreground">Tidak ada data pembayaran</p>
  }

  return (
    <div className="space-y-6">
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
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Metode Pembayaran:</span>
              <span>{payment.paymentMethod === "TRANSFER" ? "Transfer Bank" : "Tunai"}</span>
            </div>
            {payment.status === "APPROVED" && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium">
                  {payment.isLate ? (
                    <Badge variant="destructive" className="ml-2">
                      Terlambat
                    </Badge>
                  ) : (
                    <Badge variant="default" className="ml-2">
                      Tepat Waktu
                    </Badge>
                  )}
                </span>
              </div>
            )}
            <div className="mt-2">
              {payment.status === "REJECTED" && (
                <div className="flex items-center gap-2 text-sm text-destructive mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Pembayaran ditolak. Silakan unggah bukti pembayaran baru.</span>
                </div>
              )}

              {payment.proofImageUrl && payment.status !== "REJECTED" ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {payment.status === "WAITING_FOR_APPROVAL"
                      ? "Menunggu persetujuan admin"
                      : payment.status === "APPROVED"
                        ? "Pembayaran telah disetujui"
                        : "Pembayaran ditolak"}
                  </span>
                  {payment.paymentMethod === "TRANSFER" && (
                    <Button variant="outline" size="sm" onClick={() => window.open(payment.proofImageUrl!, "_blank")}>
                      Lihat Bukti
                    </Button>
                  )}
                </div>
              ) : canUploadPayment(payment) ? (
                <Button variant="outline" size="sm" className="w-full" onClick={() => scrollToBottom(payment)}>
                  <Upload className="mr-2 h-4 w-4" />
                  {payment.status === "REJECTED" ? "Unggah Bukti Baru" : "Konfirmasi Pembayaran"}
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">Belum ada konfirmasi pembayaran</span>
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
      {/* Floating scroll button */}
      {showScrollButton && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg animate-bounce-slow z-50"
          onClick={() => scrollToB()}
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      )}

      {/* Reference div at the bottom of the page */}
      <div ref={bottomRef} />
    </div>
  )
}


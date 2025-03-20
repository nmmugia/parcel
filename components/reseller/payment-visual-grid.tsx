"use client"

import { useState } from "react"
import type { Payment } from "@prisma/client"
import { Clock, AlertTriangle, CheckCircle, Clock3, HelpCircle, Info } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PaymentVisualGridProps {
  payments: Payment[]
  onSelectPayment: (payment: Payment) => void
  selectedCount: number
}

export function PaymentVisualGrid({ payments, onSelectPayment, selectedCount }: PaymentVisualGridProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  // Get payment status color and icon
  const getPaymentStatusInfo = (payment: Payment) => {
    switch (payment.status) {
      case "APPROVED":
        return {
          color: payment.isLate ? "bg-yellow-100 border-yellow-300" : "bg-green-100 border-green-300",
          icon: payment.isLate ? (
            <CheckCircle className="h-4 w-4 text-yellow-500" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ),
          label: payment.isLate ? "Dibayar Terlambat" : "Dibayar Tepat Waktu",
        }
      case "WAITING_FOR_APPROVAL":
        return {
          color: "bg-blue-100 border-blue-300",
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          label: "Menunggu Persetujuan",
        }
      case "REJECTED":
        return {
          color: "bg-red-100 border-red-300",
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
          label: "Ditolak",
        }
      case "WAITING_FOR_PAYMENT":
        return {
          color: "bg-gray-100 border-gray-300",
          icon: <HelpCircle className="h-4 w-4 text-gray-500" />,
          label: "Belum Dibayar",
        }
      default:
        return {
          color: "bg-gray-100 border-gray-300",
          icon: <Info className="h-4 w-4 text-gray-500" />,
          label: payment.status,
        }
    }
  }

  // Check if payment is selectable (unpaid)
  const isSelectable = (payment: Payment) => {
    return payment.status === "WAITING_FOR_PAYMENT" || payment.status === "REJECTED"
  }

  // Check if payment is selected based on the current week selection
  const isSelected = (payment: Payment, index: number) => {
    if (!isSelectable(payment)) return false

    // Get all selectable payments
    const selectablePayments = payments.filter((p) => isSelectable(p))

    // Check if this payment is within the selected count
    const selectableIndex = selectablePayments.indexOf(payment)
    return selectableIndex < selectedCount
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Status Cicilan</h3>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {payments.map((payment, index) => {
          const { color, icon, label } = getPaymentStatusInfo(payment)
          const selected = isSelected(payment, index)

          return (
            <TooltipProvider key={payment.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`
                      relative aspect-square border-2 rounded-md flex items-center justify-center cursor-pointer
                      transition-all duration-200 hover:scale-105
                      ${color}
                      ${selected ? "ring-2 ring-primary ring-offset-2" : ""}
                      ${isSelectable(payment) ? "hover:border-primary" : ""}
                    `}
                    onClick={() => {
                      setSelectedPayment(payment)
                      if (isSelectable(payment)) {
                        onSelectPayment(payment)
                      }
                    }}
                  >
                    {icon}
                    <div className="absolute -top-2 -right-2 text-xs font-bold bg-background rounded-full w-5 h-5 flex items-center justify-center border">
                      {index + 1}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-xs">
                    <div className="font-bold">Cicilan {index + 1}</div>
                    <div>Jatuh tempo: {formatDate(payment.dueDate)}</div>
                    <div>Jumlah: {formatCurrency(payment.amount)}</div>
                    <div>Status: {label}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      {/* Payment detail dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        {selectedPayment && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detail Cicilan</DialogTitle>
              <DialogDescription>
                Informasi cicilan untuk tanggal {formatDate(selectedPayment.dueDate)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">Jumlah</div>
                  <div className="font-bold">{formatCurrency(selectedPayment.amount)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Status</div>
                  <div>
                    <Badge
                      variant={
                        selectedPayment.status === "APPROVED"
                          ? selectedPayment.isLate
                            ? "warning"
                            : "success"
                          : selectedPayment.status === "REJECTED"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {getPaymentStatusInfo(selectedPayment).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Jatuh Tempo</div>
                  <div>{formatDate(selectedPayment.dueDate)}</div>
                </div>
                {selectedPayment.paidDate && (
                  <div>
                    <div className="text-sm font-medium mb-1">Tanggal Bayar</div>
                    <div>{formatDate(selectedPayment.paidDate)}</div>
                  </div>
                )}
                {selectedPayment.paymentMethod && (
                  <div>
                    <div className="text-sm font-medium mb-1">Metode</div>
                    <div>{selectedPayment.paymentMethod === "TRANSFER" ? "Transfer Bank" : "Tunai"}</div>
                  </div>
                )}
              </div>

              {selectedPayment.proofImageUrl && selectedPayment.paymentMethod === "TRANSFER" && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedPayment.proofImageUrl!, "_blank")}
                  >
                    Lihat Bukti Pembayaran
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm"></div>
          <span>Belum Dibayar</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm"></div>
          <span>Dibayar Tepat Waktu</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-sm"></div>
          <span>Dibayar Terlambat</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-sm"></div>
          <span>Menunggu Persetujuan</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm"></div>
          <span>Ditolak</span>
        </div>
      </div>
    </div>
  )
}


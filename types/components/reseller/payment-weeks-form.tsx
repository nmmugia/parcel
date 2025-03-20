"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Payment as PaymentType } from "@prisma/client"
import { Check, Copy, Loader2, Upload, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { PaymentVisualGrid } from "./payment-visual-grid"

type BankAccount = {
  bank: string
  accountNumber: string
  accountName: string
}

type Payment = {
  id: string
  amount: number
  status: string
  createdAt: string
  dueDate: string
}

const bankAccounts: BankAccount[] = [
  { bank: "BCA", accountNumber: "4530052457", accountName: "Nita Novianti" },
  { bank: "BNI", accountNumber: "0819440953", accountName: "Nita Novianti" },
  { bank: "BRI", accountNumber: "107701005903506", accountName: "Nita Novianti" },
  { bank: "Mandiri", accountNumber: "9000032646763", accountName: "Nita Novianti" },
]

export function PaymentWeeksForm({
  payments,
  transactionId,
  onClose,
  onSuccess,
}: {
  payments: PaymentType[]
  transactionId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("transfer")
  const [file, setFile] = useState<File | null>(null)
  const [copiedBank, setCopiedBank] = useState<string | null>(null)
  const [weeksCount, setWeeksCount] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Get unpaid payments
  const unpaidPayments = payments
    .filter((p) => p.status === "WAITING_FOR_PAYMENT" || p.status === "REJECTED")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  // Limit weeks count to available unpaid payments
  useEffect(() => {
    if (weeksCount > unpaidPayments.length) {
      setWeeksCount(unpaidPayments.length)
    }
  }, [weeksCount, unpaidPayments.length])

  // Calculate total amount based on selected weeks
  const selectedPayments = unpaidPayments.slice(0, weeksCount)
  const totalAmount = selectedPayments.reduce((sum, p) => sum + p.amount, 0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (weeksCount <= 0) {
      toast({
        title: "Error",
        description: "Pilih minimal 1 minggu untuk dibayar",
        variant: "destructive",
      })
      return
    }

    if (!file && paymentMethod === "transfer") {
      toast({
        title: "Error",
        description: "Silakan unggah bukti pembayaran",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create FormData
      const formData = new FormData()

      // Add file if available
      if (file) {
        formData.append("file", file)
      }

      // Add payment method and notes
      formData.append("paymentMethod", paymentMethod)

      // Add transaction ID
      formData.append("transactionId", transactionId)

      // Add payment IDs as JSON string
      formData.append("paymentIds", JSON.stringify(selectedPayments.map((p) => p.id)))

      // Send to the multi-payment endpoint
      const response = await fetch(`/api/payments/upload-multiple`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: `Pembayaran untuk ${weeksCount} minggu berhasil diunggah`,
        })
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Gagal mengunggah bukti pembayaran")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (accountNumber: string, bank: string) => {
    navigator.clipboard.writeText(accountNumber)
    setCopiedBank(bank)
    setTimeout(() => setCopiedBank(null), 2000)
  }

  // Handle payment selection from the visual grid
  const handleSelectPayment = (payment: PaymentType) => {
    // Find the index of the payment in the unpaid payments
    const index = unpaidPayments.findIndex((p) => p.id === payment.id)
    if (index >= 0) {
      // Set the weeks count to the index + 1
      setWeeksCount(index + 1)
    }
  }

  // Inline loading overlay
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2 rounded-md bg-background p-4 shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Memproses...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Pembayaran Cicilan</CardTitle>
          <CardDescription>Pilih jumlah minggu yang ingin dibayar</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Weeks selector */}
          <div className="space-y-2">
            <Label>Jumlah Minggu</Label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setWeeksCount(Math.max(1, weeksCount - 1))}
                disabled={weeksCount <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="range"
                    min={1}
                    max={unpaidPayments.length || 1}
                    value={weeksCount}
                    onChange={(e) => setWeeksCount(Number.parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    {unpaidPayments.length > 2 && <span>{Math.floor(unpaidPayments.length / 2)}</span>}
                    <span>{unpaidPayments.length}</span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setWeeksCount(Math.min(unpaidPayments.length, weeksCount + 1))}
                disabled={weeksCount >= unpaidPayments.length}
              >
                <Plus className="h-4 w-4" />
              </Button>

              <div className="w-16 text-center font-bold text-lg">{weeksCount}</div>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span>Total Pembayaran:</span>
              <span className="font-bold">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {/* Visual payment grid */}
          <PaymentVisualGrid payments={payments} onSelectPayment={handleSelectPayment} selectedCount={weeksCount} />

          {/* Payment method */}
          <div className="space-y-2">
            <Label>Metode Pembayaran</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="font-normal">
                  Transfer Bank
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="font-normal">
                  Tunai
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "transfer" && (
            <>
              <div className="space-y-2">
                <Label>Transfer ke salah satu rekening berikut:</Label>
                <Tabs defaultValue="BCA" className="w-full">
                  <TabsList className="w-full flex flex-wrap h-auto min-h-10">
                    {bankAccounts.map((account) => (
                      <TabsTrigger key={account.bank} value={account.bank} className="whitespace-normal break-words">
                        Bank {account.bank}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {bankAccounts.map((account) => (
                    <TabsContent key={account.bank} value={account.bank} className="mt-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm">Bank</Label>
                              <p className="font-medium">{account.bank}</p>
                            </div>
                            <div>
                              <Label className="text-sm">Nomor Rekening</Label>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium">{account.accountNumber}</p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(account.accountNumber, account.bank)}
                                >
                                  {copiedBank === account.bank ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm">Nama Pemilik</Label>
                              <p className="font-medium">{account.accountName}</p>
                            </div>
                            <div>
                              <Label className="text-sm">Jumlah Transfer</Label>
                              <p className="font-bold text-lg">{formatCurrency(totalAmount)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Unggah Bukti Pembayaran</Label>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Pilih File
                  </Button>
                  <Input
                    ref={fileInputRef}
                    id="file"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {file && <span className="text-sm text-muted-foreground">{file.name}</span>}
                </div>
              </div>
            </>
          )}

        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button type="submit" disabled={isLoading || weeksCount === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Bayar {weeksCount} Minggu
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}


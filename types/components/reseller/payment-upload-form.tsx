"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Payment } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Loader2, Copy, Upload, X, ImageIcon, Check } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



type BankAccount = {
  bank: string
  accountNumber: string
  accountName: string
}

const bankAccounts: BankAccount[] = [
  { bank: "BCA", accountNumber: "4530052457", accountName: "Nita Novianti" },
  { bank: "BNI", accountNumber: "0819440953", accountName: "Nita Novianti" },
  { bank: "BRI", accountNumber: "107701005903506", accountName: "Nita Novianti" },
  { bank: "Mandiri", accountNumber: "9000032646763", accountName: "Nita Novianti" },
]


interface PaymentUploadFormProps {
  payment: Payment
  transactionId: string
  onClose: () => void
  onSuccess: () => void
}

export function PaymentUploadForm({ payment, transactionId, onClose, onSuccess }: PaymentUploadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TRANSFER">("TRANSFER")
  const [mounted, setMounted] = useState(false)
  const [copiedBank, setCopiedBank] = useState<string | null>(null)


  // Fix hydration issues by only rendering client-side content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi tipe file
    const validTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Format file tidak didukung",
        description: "Silakan unggah file dengan format JPG atau PNG",
      })
      return
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Ukuran file terlalu besar",
        description: "Ukuran file maksimal 5MB",
      })
      return
    }

    setImageFile(file)

    // Buat preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (paymentMethod === "TRANSFER" && !imageFile) {
      toast({
        variant: "destructive",
        title: "Bukti pembayaran wajib diunggah",
        description: "Silakan unggah bukti pembayaran terlebih dahulu",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let proofImageUrl = null

      // Upload image only for TRANSFER method
      if (paymentMethod === "TRANSFER" && imageFile) {
        // Upload gambar
        const formData = new FormData()
        formData.append("file", imageFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json()
          throw new Error(error.message || "Terjadi kesalahan saat mengunggah bukti pembayaran")
        }

        const uploadData = await uploadResponse.json()
        proofImageUrl = uploadData.fileUrl
      }

      // Update pembayaran
      const response = await fetch(`/api/payments/${payment.id}/upload-proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proofImageUrl,
          transactionId,
          paymentMethod,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menyimpan bukti pembayaran")
      }

      toast({
        title: "Berhasil",
        description:
          paymentMethod === "TRANSFER" ? "Bukti pembayaran berhasil diunggah" : "Pembayaran tunai berhasil dicatat",
      })

      onSuccess()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah bukti pembayaran",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (accountNumber: string, bank: string) => {
    navigator.clipboard.writeText(accountNumber)
    setCopiedBank(bank)
    setTimeout(() => setCopiedBank(null), 2000)
  }

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null
  }

  const isRejected = payment.status === "REJECTED"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isRejected ? "Unggah Ulang Bukti Pembayaran" : "Unggah Bukti Pembayaran"}</CardTitle>
        <CardDescription>
          {isRejected
            ? "Pembayaran sebelumnya ditolak. Silakan unggah bukti pembayaran baru."
            : `Unggah bukti pembayaran ${formatDate(payment.dueDate)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Jumlah Pembayaran:</span>
            <span className="font-medium">{formatCurrency(payment.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Batas Pembayaran:</span>
            <span className="font-medium">{formatDate(payment.dueDate)}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <Label>Metode Pembayaran</Label>
          <RadioGroup
            defaultValue={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as "CASH" | "TRANSFER")}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="TRANSFER" id="transfer" />
              <Label htmlFor="transfer">Transfer Bank</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CASH" id="cash" />
              <Label htmlFor="cash">Tunai</Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === "TRANSFER" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Bukti Pembayaran</span>
              {imagePreview && (
                <Button variant="destructive" size="sm" onClick={clearImage}>
                  <X className="mr-2 h-4 w-4" />
                  Hapus
                </Button>
              )}
            </div>
            <div className="space-y-2">
                <Label>Transfer to one of these accounts:</Label>
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
                              <Label className="text-sm">Atas Nama</Label>
                              <p className="font-medium">{account.accountName}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

            {imagePreview ? (
              <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors duration-200 bg-blue-50 border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                role="button"
                aria-label="Upload bukti pembayaran"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    fileInputRef.current?.click()
                  }
                }}
              >
                <ImageIcon className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-blue-700">Klik untuk unggah bukti pembayaran</p>
                <p className="text-xs text-blue-600 mt-1">Format: JPG, PNG (Maks. 5MB)</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        ) : (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-700">
              Pembayaran tunai akan diproses tanpa bukti pembayaran. Admin akan memverifikasi pembayaran secara manual.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || (paymentMethod === "TRANSFER" && !imageFile)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {paymentMethod === "TRANSFER" ? (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {isRejected ? "Unggah Bukti Baru" : "Unggah Bukti"}
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              {isRejected ? "Konfirmasi Ulang Pembayaran Tunai" : "Konfirmasi Pembayaran Tunai"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}


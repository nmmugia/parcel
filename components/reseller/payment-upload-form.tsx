"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Payment } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Loader2, Upload, X, ImageIcon } from "lucide-react"

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
    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "Bukti pembayaran wajib diunggah",
        description: "Silakan unggah bukti pembayaran terlebih dahulu",
      })
      return
    }

    setIsSubmitting(true)

    try {
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
      const proofImageUrl = uploadData.fileUrl

      // Update pembayaran
      const response = await fetch(`/api/payments/${payment.id}/upload-proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proofImageUrl,
          transactionId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menyimpan bukti pembayaran")
      }

      toast({
        title: "Berhasil",
        description: "Bukti pembayaran berhasil diunggah",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unggah Bukti Pembayaran</CardTitle>
        <CardDescription>Unggah bukti pembayaran untuk cicilan {formatDate(payment.dueDate)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Jumlah Pembayaran:</span>
            <span className="font-medium">{formatCurrency(payment.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jatuh Tempo:</span>
            <span className="font-medium">{formatDate(payment.dueDate)}</span>
          </div>
        </div>

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

          {imagePreview ? (
            <div className="relative aspect-video w-full rounded-md overflow-hidden border">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Klik untuk unggah bukti pembayaran</p>
              <p className="text-xs text-muted-foreground mt-1">Format: JPG, PNG (Maks. 5MB)</p>
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
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !imageFile}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengunggah...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Unggah Bukti
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}


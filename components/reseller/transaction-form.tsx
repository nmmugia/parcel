"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Package } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const transactionSchema = z.object({
  customerName: z.string().min(1, "Nama pelanggan wajib diisi"),
  customerPhone: z.string().min(1, "Nomor telepon wajib diisi"),
  customerAddress: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  packageData: Package
  resellerId: string
  onCancel: () => void
}

export function TransactionForm({ packageData, resellerId, onCancel }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerAddress: "",
    },
  })

  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          packageId: packageData.id,
          resellerId,
          totalAmount: packageData.price,
          tenorMonths: packageData.tenorMonths,
          monthlyAmount: packageData.monthlyAmount,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat membuat transaksi")
      }

      const result = await response.json()

      toast({
        title: "Berhasil",
        description: "Transaksi berhasil dibuat",
      })

      router.push(`/reseller/transactions/${result.id}`)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat membuat transaksi",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Transaksi</CardTitle>
        <CardDescription>Masukkan informasi pelanggan untuk membuat transaksi baru</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-md">
          <h3 className="font-medium mb-2">Informasi Paket</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Nama Paket:</div>
            <div className="font-medium">{packageData.name}</div>
            <div>Harga Total:</div>
            <div className="font-medium">{formatCurrency(packageData.price)}</div>
            <div>Tenor:</div>
            <div className="font-medium">{packageData.tenorMonths} bulan</div>
            <div>Cicilan per Bulan:</div>
            <div className="font-medium">{formatCurrency(packageData.monthlyAmount)}</div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pelanggan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama pelanggan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor telepon pelanggan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan alamat pelanggan" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Batal
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Buat Transaksi
        </Button>
      </CardFooter>
    </Card>
  )
}


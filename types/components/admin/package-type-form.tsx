"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { PackageType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { IconPicker } from "@/components/icon-picker"
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const packageTypeSchema = z.object({
  name: z.string().min(1, "Nama jenis paket wajib diisi"),
  description: z.string().optional(),
  icon: z.string().min(1, "Icon wajib dipilih"),
  isBonusEligible: z.boolean().default(false),
})

type PackageTypeFormValues = z.infer<typeof packageTypeSchema>

interface PackageTypeFormProps {
  packageType?: PackageType
}

export function PackageTypeForm({ packageType }: PackageTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<PackageTypeFormValues>({
    resolver: zodResolver(packageTypeSchema),
    defaultValues: {
      name: packageType?.name || "",
      description: packageType?.description || "",
      icon: packageType?.icon || "package",
      isBonusEligible: packageType?.isBonusEligible ?? true,
    },
  })

  const onSubmit = async (data: PackageTypeFormValues) => {
    setIsSubmitting(true)

    try {
      const url = packageType ? `/api/package-types/${packageType.id}` : "/api/package-types"

      const method = packageType ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menyimpan jenis paket")
      }

      toast({
        title: "Berhasil",
        description: packageType ? "Jenis paket berhasil diperbarui" : "Jenis paket berhasil ditambahkan",
      })

      router.push("/admin/package-types")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan jenis paket",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Jenis Paket</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama jenis paket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan deskripsi jenis paket" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <IconPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isBonusEligible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Apakah Berbonus?</FormLabel>
                    <FormDescription>
                      Jika dicentang, reseller akan mendapatkan bonus untuk transaksi dengan jenis paket ini.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/package-types")}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {packageType ? "Perbarui" : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


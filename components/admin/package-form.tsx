"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Package, PackageType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

const packageSchema = z.object({
  name: z.string().min(1, "Nama paket wajib diisi"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Harga harus lebih dari 0"),
  tenorMonths: z.coerce.number().int().positive("Tenor harus lebih dari 0"),
  monthlyAmount: z.coerce.number().positive("Cicilan bulanan harus lebih dari 0"),
  packageTypeId: z.string().min(1, "Jenis paket wajib dipilih"),
  isActive: z.boolean().default(true),
})

type PackageFormValues = z.infer<typeof packageSchema>

interface PackageFormProps {
  packageTypes: PackageType[]
  packageData?: Package
}

export function PackageForm({ packageTypes, packageData }: PackageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(packageData?.imageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: packageData?.name || "",
      description: packageData?.description || "",
      price: packageData?.price || 0,
      tenorMonths: packageData?.tenorMonths || 12,
      monthlyAmount: packageData?.monthlyAmount || 0,
      packageTypeId: packageData?.packageTypeId || "",
      isActive: packageData?.isActive ?? true,
    },
  })

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

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat mengunggah gambar")
      }

      const data = await response.json()
      return data.fileUrl
    } catch (error) {
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: PackageFormValues) => {
    setIsSubmitting(true)

    try {
      let imageUrl = packageData?.imageUrl || null

      // Upload gambar jika ada
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const url = packageData ? `/api/packages/${packageData.id}` : "/api/packages"

      const method = packageData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          imageUrl,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menyimpan paket")
      }

      toast({
        title: "Berhasil",
        description: packageData ? "Paket berhasil diperbarui" : "Paket berhasil ditambahkan",
      })

      router.push("/admin/packages")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan paket",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Hitung cicilan bulanan otomatis
  const calculateMonthlyAmount = (price: number, tenorMonths: number) => {
    if (price && tenorMonths && tenorMonths > 0) {
      const monthlyAmount = price / tenorMonths
      form.setValue("monthlyAmount", monthlyAmount)
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
                  <FormLabel>Nama Paket</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama paket" {...field} />
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
                    <Textarea placeholder="Masukkan deskripsi paket" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Total (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Masukkan harga total"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          calculateMonthlyAmount(Number.parseFloat(e.target.value), form.getValues("tenorMonths"))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tenorMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenor (Bulan)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Masukkan tenor dalam bulan"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          calculateMonthlyAmount(form.getValues("price"), Number.parseFloat(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="monthlyAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cicilan per Bulan (Rp)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Masukkan cicilan per bulan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="packageTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Paket</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis paket" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {packageTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Aktif</FormLabel>
                    <p className="text-sm text-muted-foreground">Paket yang aktif akan ditampilkan kepada reseller</p>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Gambar Paket (Opsional)</FormLabel>
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Unggah Gambar
                </Button>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg, image/png"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <Button type="button" variant="destructive" size="sm" onClick={clearImage}>
                    <X className="mr-2 h-4 w-4" />
                    Hapus Gambar
                  </Button>
                )}
              </div>

              {imagePreview && (
                <div className="mt-4 relative aspect-video w-full max-w-md rounded-md overflow-hidden border">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/packages")}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {packageData ? "Perbarui" : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const resellerSchema = z.object({
  name: z.string().min(1, "Nama reseller wajib diisi"),
  email: z.string().email("Email tidak valid"),
})

type ResellerFormValues = z.infer<typeof resellerSchema>

interface ResellerFormProps {
  reseller?: User
}

export function ResellerForm({ reseller }: ResellerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<ResellerFormValues>({
    resolver: zodResolver(resellerSchema),
    defaultValues: {
      name: reseller?.name || "",
      email: reseller?.email || "",
    },
  })

  const onSubmit = async (data: ResellerFormValues) => {
    setIsSubmitting(true)

    try {
      const url = reseller ? `/api/resellers/${reseller.id}` : "/api/resellers"

      const method = reseller ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menyimpan reseller")
      }

      const responseData = await response.json()

      toast({
        title: "Berhasil",
        description: reseller ? "Reseller berhasil diperbarui" : "Reseller berhasil ditambahkan",
      })

      if (!reseller) {
        setGeneratedPassword(responseData.password)
        setShowPasswordDialog(true)
      } else {
        router.push("/admin/resellers")
        router.refresh()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan reseller",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Berhasil",
      description: "Password berhasil disalin ke clipboard",
    })
  }

  const handleClosePasswordDialog = () => {
    setShowPasswordDialog(false)
    router.push("/admin/resellers")
    router.refresh()
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Reseller</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama reseller" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Masukkan email reseller" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/resellers")}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {reseller ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reseller Berhasil Ditambahkan</DialogTitle>
            <DialogDescription>
              Password untuk reseller ini telah dibuat secara otomatis. Salin password ini dan bagikan kepada reseller.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="mb-2">Password:</p>
              <div className="flex items-center justify-center gap-2">
                <Input value={generatedPassword} readOnly className="text-center font-mono" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedPassword)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Password ini hanya akan ditampilkan sekali</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleClosePasswordDialog}>Selesai</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


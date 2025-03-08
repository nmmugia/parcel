"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Percent } from "lucide-react"

const bonusSettingsSchema = z.object({
  resellerBonusRate: z.coerce
    .number()
    .min(0, "Persentase bonus tidak boleh negatif")
    .max(100, "Persentase bonus tidak boleh lebih dari 100%"),
  adminBonusRate: z.coerce
    .number()
    .min(0, "Persentase bonus tidak boleh negatif")
    .max(100, "Persentase bonus tidak boleh lebih dari 100%"),
})

type BonusSettingsFormValues = z.infer<typeof bonusSettingsSchema>

interface BonusSettingsFormProps {
  initialValues: {
    resellerBonusRate: number
    adminBonusRate: number
  }
}

export function BonusSettingsForm({ initialValues }: BonusSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<BonusSettingsFormValues>({
    resolver: zodResolver(bonusSettingsSchema),
    defaultValues: {
      resellerBonusRate: initialValues.resellerBonusRate * 100, // Convert to percentage
      adminBonusRate: initialValues.adminBonusRate * 100, // Convert to percentage
    },
  })

  const onSubmit = async (data: BonusSettingsFormValues) => {
    setIsSubmitting(true)

    try {
      // Convert percentages back to decimals
      const bonusRates = {
        resellerBonusRate: data.resellerBonusRate / 100,
        adminBonusRate: data.adminBonusRate / 100,
      }

      const response = await fetch("/api/settings/bonus-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bonusRates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menyimpan pengaturan")
      }

      toast({
        title: "Berhasil",
        description: "Pengaturan bonus berhasil disimpan",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan pengaturan",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Pengaturan Bonus</CardTitle>
        <CardDescription>Atur persentase bonus untuk reseller dan admin</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="resellerBonusRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persentase Bonus Reseller (%)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" step="0.1" {...field} />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Persentase dari jumlah pembayaran yang akan diberikan sebagai bonus kepada reseller
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adminBonusRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persentase Bonus Admin (%)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" step="0.1" {...field} />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Persentase dari jumlah pembayaran yang akan diberikan sebagai bonus kepada admin
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan Pengaturan
        </Button>
      </CardFooter>
    </Card>
  )
}


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Package, PackageType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { IconDisplay } from "@/components/icon-display"
import { PackageIcon, ArrowLeft, ShoppingCart } from "lucide-react"
import { TransactionForm } from "@/components/reseller/transaction-form"
import { ZoomableImage } from "@/components/zoomable-image"

interface PackageWithType extends Package {
  packageType: PackageType
}

interface PackageDetailProps {
  packageData: PackageWithType
  resellerId: string
}

export function PackageDetail({ packageData, resellerId }: PackageDetailProps) {
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detail Paket</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <IconDisplay icon={packageData.packageType.icon} className="h-5 w-5" />
              <CardTitle>{packageData.name}</CardTitle>
            </div>
            <CardDescription className="mt-2">{packageData.description || "Tidak ada deskripsi"}</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="aspect-video relative rounded-md overflow-hidden mb-4">
              {packageData.imageUrl ? (
                <ZoomableImage
                  src={packageData.imageUrl}
                  alt={packageData.name}
                  fallbackIcon={<PackageIcon className="h-12 w-12 text-muted-foreground" />}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <PackageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Harga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jenis Paket:</span>
                <span className="font-medium">{packageData.packageType.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Minggu:</span>
                <span className="font-medium">{packageData.tenorWeeks} Minggu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pembayaran per Minggu:</span>
                <span className="font-medium">{formatCurrency(packageData.weeklyAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deskripsi:</span>
                <span className="font-medium">{packageData.description}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setShowTransactionForm(true)} disabled={showTransactionForm}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buat Transaksi
            </Button>
          </CardFooter>
        </Card>
      </div>

      {showTransactionForm && (
        <TransactionForm
          packageData={packageData}
          resellerId={resellerId}
          onCancel={() => setShowTransactionForm(false)}
        />
      )}
    </div>
  )
}


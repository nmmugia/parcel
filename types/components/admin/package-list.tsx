"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Package as PackageType, PackageType as PackageTypeModel } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, Package, ToggleLeft, ToggleRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { IconDisplay } from "@/components/icon-display"
import { ZoomableImage } from "@/components/zoomable-image"

interface PackageWithType extends PackageType {
  packageType: PackageTypeModel
}

interface PackageListProps {
  packages: PackageWithType[]
}

export function PackageList({ packages }: PackageListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    setIsDeleting(id)

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menghapus paket")
      }

      toast({
        title: "Berhasil",
        description: "Paket berhasil dihapus",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus paket",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setIsToggling(id)

    try {
      const response = await fetch(`/api/packages/${id}/toggle-active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat mengubah status paket")
      }

      toast({
        title: "Berhasil",
        description: `Paket berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}`,
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengubah status paket",
      })
    } finally {
      setIsToggling(null)
    }
  }

  if (packages.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-center">Belum ada paket</p>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
            Tambahkan paket untuk mulai menawarkan kepada reseller
          </p>
          <Link href="/admin/packages/create">
            <Button>Tambah Paket</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {packages.map((packageItem) => (
        <Card key={packageItem.id} className={packageItem.isActive ? "" : "opacity-70"}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconDisplay icon={packageItem.packageType.icon} className="h-5 w-5" />
                <CardTitle className="text-lg">{packageItem.name}</CardTitle>
              </div>
              <Badge variant={packageItem.isActive ? "default" : "secondary"}>
                {packageItem.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
            {packageItem.description && <CardDescription className="mt-2">{packageItem.description}</CardDescription>}
          </CardHeader>
          <CardContent className="pb-3">
            <div className="aspect-video relative rounded-md overflow-hidden mb-4">
              {packageItem.imageUrl ? (
                <ZoomableImage
                  src={packageItem.imageUrl}
                  alt={packageItem.name}
                  fallbackIcon={<Package className="h-12 w-12 text-muted-foreground" />}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Minggu:</span>
                <span className="font-medium">{packageItem.tenorWeeks} minggu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pembayaran per Minggu:</span>
                <span className="font-medium">{formatCurrency(packageItem.weeklyAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jenis Paket:</span>
                <span className="font-medium">{packageItem.packageType.name}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-3">
            <div className="flex gap-2">
              <Link href={`/admin/packages/${packageItem.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant={packageItem.isActive ? "secondary" : "default"}
                size="sm"
                onClick={() => handleToggleActive(packageItem.id, packageItem.isActive)}
                disabled={isToggling === packageItem.id}
              >
                {isToggling === packageItem.id ? (
                  "Memproses..."
                ) : (
                  <>
                    {packageItem.isActive ? (
                      <ToggleLeft className="h-4 w-4 mr-2" />
                    ) : (
                      <ToggleRight className="h-4 w-4 mr-2" />
                    )}
                    {packageItem.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </>
                )}
              </Button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Paket</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(packageItem.id)}
                    disabled={isDeleting === packageItem.id}
                  >
                    {isDeleting === packageItem.id ? "Menghapus..." : "Hapus"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}


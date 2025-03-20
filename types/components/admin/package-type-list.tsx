"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { PackageType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, Package } from "lucide-react"
import { IconDisplay } from "@/components/icon-display"

interface PackageTypeListProps {
  packageTypes: PackageType[]
}

export function PackageTypeList({ packageTypes }: PackageTypeListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    setIsDeleting(id)

    try {
      const response = await fetch(`/api/package-types/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menghapus jenis paket")
      }

      toast({
        title: "Berhasil",
        description: "Jenis paket berhasil dihapus",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus jenis paket",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  if (packageTypes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-center">Belum ada jenis paket</p>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
            Tambahkan jenis paket untuk mulai mengelola paket
          </p>
          <Link href="/admin/package-types/create">
            <Button>Tambah Jenis Paket</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {packageTypes.map((packageType) => (
        <Card key={packageType.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <IconDisplay icon={packageType.icon} className="h-5 w-5" />
              <CardTitle>{packageType.name}</CardTitle>
            </div>
            {
            packageType.isBonusEligible &&
            <div className="flex items-center gap-2">
              <Badge variant="success">Berbonus</Badge>
            </div>
            }
            {packageType.description && <CardDescription className="mt-2">{packageType.description}</CardDescription>}
          </CardHeader>
          <CardFooter className="flex justify-between pt-3">
            <Link href={`/admin/package-types/${packageType.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Jenis Paket</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus jenis paket ini? Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(packageType.id)}
                    disabled={isDeleting === packageType.id}
                  >
                    {isDeleting === packageType.id ? "Menghapus..." : "Hapus"}
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


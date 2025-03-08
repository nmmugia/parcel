"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@prisma/client"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, Users, RefreshCw, Copy } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface ResellerListProps {
  resellers: User[]
}

export function ResellerList({ resellers }: ResellerListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    setIsDeleting(id)

    try {
      const response = await fetch(`/api/resellers/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat menghapus reseller")
      }

      toast({
        title: "Berhasil",
        description: "Reseller berhasil dihapus",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus reseller",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleRegeneratePassword = async (id: string) => {
    setIsRegenerating(id)

    try {
      const response = await fetch(`/api/resellers/${id}/regenerate-password`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Terjadi kesalahan saat mengatur ulang password")
      }

      const data = await response.json()
      setNewPassword(data.password)

      toast({
        title: "Berhasil",
        description: "Password reseller berhasil diatur ulang",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengatur ulang password",
      })
    } finally {
      setIsRegenerating(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Berhasil",
      description: "Password berhasil disalin ke clipboard",
    })
  }

  if (resellers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-center">Belum ada reseller</p>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
            Tambahkan reseller untuk mulai menjual paket
          </p>
          <Link href="/admin/resellers/create">
            <Button>Tambah Reseller</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {resellers.map((reseller) => (
        <Card key={reseller.id}>
          <CardHeader className="pb-3">
            <CardTitle>{reseller.name}</CardTitle>
            <CardDescription>{reseller.email}</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-sm text-muted-foreground">Terdaftar pada {formatDate(reseller.createdAt)}</div>
          </CardContent>
          <CardFooter className="flex justify-between pt-3">
            <div className="flex gap-2">
              <Link href={`/admin/resellers/${reseller.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Apakah Anda yakin ingin mengatur ulang password untuk reseller ini?
                    </DialogDescription>
                  </DialogHeader>
                  {newPassword ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="mb-2">Password baru:</p>
                        <div className="flex items-center justify-center gap-2">
                          <Input value={newPassword} readOnly className="text-center font-mono" />
                          <Button variant="outline" size="icon" onClick={() => copyToClipboard(newPassword)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Salin password ini dan bagikan kepada reseller
                        </p>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setNewPassword(null)}>Tutup</Button>
                      </DialogFooter>
                    </div>
                  ) : (
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewPassword(null)}>
                        Batal
                      </Button>
                      <Button
                        onClick={() => handleRegeneratePassword(reseller.id)}
                        disabled={isRegenerating === reseller.id}
                      >
                        {isRegenerating === reseller.id ? "Memproses..." : "Reset Password"}
                      </Button>
                    </DialogFooter>
                  )}
                </DialogContent>
              </Dialog>
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
                  <AlertDialogTitle>Hapus Reseller</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus reseller ini? Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(reseller.id)} disabled={isDeleting === reseller.id}>
                    {isDeleting === reseller.id ? "Menghapus..." : "Hapus"}
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


"use client"

import Link from "next/link"
import type { Transaction, Payment, Package } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ShoppingCart, CreditCard, CheckCircle, DollarSign, ArrowRight, Upload } from "lucide-react"

interface TransactionWithRelations extends Transaction {
  package: Package
  payments: Payment[]
}

interface ResellerDashboardProps {
  activeTransactions: number
  pendingPayments: number
  approvedPayments: number
  totalBonus: number
  recentTransactions: TransactionWithRelations[]
}

export function ResellerDashboard({
  activeTransactions,
  pendingPayments,
  approvedPayments,
  totalBonus,
  recentTransactions,
}: ResellerDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transaksi Aktif</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTransactions}</div>
            <p className="text-xs text-muted-foreground">Transaksi yang sedang berjalan</p>
          </CardContent>
          <CardFooter>
            <Link href="/reseller/transactions" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Lihat Transaksi
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pembayaran Tertunda</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Pembayaran yang belum diunggah buktinya</p>
          </CardContent>
          <CardFooter>
            <Link href="/reseller/payments" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Lihat Pembayaran
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pembayaran Disetujui</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedPayments}</div>
            <p className="text-xs text-muted-foreground">Pembayaran yang telah disetujui</p>
          </CardContent>
          <CardFooter>
            <Link href="/reseller/payments?status=APPROVED" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Lihat Detail
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bonus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBonus)}</div>
            <p className="text-xs text-muted-foreground">Bonus dari pembayaran yang disetujui</p>
          </CardContent>
          <CardFooter>
            <Link href="/reseller/payments" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Lihat Riwayat
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <CardDescription>
              {recentTransactions.length > 0 ? "Transaksi terbaru yang Anda buat" : "Belum ada transaksi"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between space-x-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{transaction.package.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.customerName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{formatCurrency(transaction.totalAmount)}</Badge>
                      <Link href={`/reseller/transactions/${transaction.id}`}>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Belum ada transaksi</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/reseller/transactions" className="w-full">
              <Button variant="outline" className="w-full">
                Lihat Semua Transaksi
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pembayaran yang Perlu Diunggah</CardTitle>
            <CardDescription>Pembayaran yang belum diunggah buktinya</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.some((t) => t.payments.length > 0) ? (
              <div className="space-y-4">
                {recentTransactions
                  .filter((t) => t.payments.length > 0)
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between space-x-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{transaction.package.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Jatuh tempo: {formatDate(transaction.payments[0].dueDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{formatCurrency(transaction.payments[0].amount)}</Badge>
                        <Link href={`/reseller/transactions/${transaction.id}`}>
                          <Button variant="ghost" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <CreditCard className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Tidak ada pembayaran yang perlu diunggah</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/reseller/payments" className="w-full">
              <Button variant="outline" className="w-full">
                Lihat Semua Pembayaran
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Mulai Transaksi Baru</CardTitle>
            <CardDescription>Pilih paket dan buat transaksi baru untuk pelanggan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground mb-4">
                Lihat katalog paket dan buat transaksi baru untuk pelanggan Anda
              </p>
              <Link href="/reseller/packages">
                <Button>Lihat Katalog Paket</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


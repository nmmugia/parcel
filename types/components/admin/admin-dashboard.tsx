"use client"

import Link from "next/link"
import type { Transaction, Payment, Package } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import {
  PackageIcon,
  Users,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Percent,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface TransactionWithRelations extends Transaction {
  package: Package
  reseller: {
    name: string
  }
}

interface PaymentWithRelations extends Payment {
  transaction: TransactionWithRelations
}

interface AdminDashboardProps {
  totalPackages: number
  totalResellers: number
  totalTransactions: number
  pendingPayments: number
  totalRevenue: number
  recentTransactions: TransactionWithRelations[]
  pendingApprovalPayments: PaymentWithRelations[]
}

export function AdminDashboard({
  totalPackages,
  totalResellers,
  totalTransactions,
  pendingPayments,
  totalRevenue,
  recentTransactions,
  pendingApprovalPayments,
}: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Paket</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
            <p className="text-xs text-muted-foreground">Jumlah paket yang tersedia</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/packages" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Kelola Paket
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reseller</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResellers}</div>
            <p className="text-xs text-muted-foreground">Jumlah reseller terdaftar</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/resellers" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Kelola Reseller
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Jumlah transaksi yang dibuat</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/transactions" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Lihat Transaksi
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Pembayaran yang menunggu persetujuan</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/payments" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Kelola Pembayaran
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Pendapatan dari pembayaran yang disetujui</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/reports" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Lihat Laporan
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
              {recentTransactions.length > 0 ? "Transaksi terbaru yang dibuat oleh reseller" : "Belum ada transaksi"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between space-x-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{transaction.package.name}</p>
                      <p className="text-sm text-muted-foreground">Reseller: {transaction.reseller.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{formatCurrency(transaction.weeklyAmount)} / Minggu</Badge>
                      <Link href={`/admin/transactions/${transaction.id}`}>
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
            <Link href="/admin/transactions" className="w-full">
              <Button variant="outline" className="w-full">
                Lihat Semua Transaksi
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pembayaran Menunggu Persetujuan</CardTitle>
            <CardDescription>Pembayaran yang perlu disetujui atau ditolak</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingApprovalPayments.length > 0 ? (
              <div className="space-y-4">
                {pendingApprovalPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between space-x-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{payment.transaction.package.name}</p>
                      <p className="text-sm text-muted-foreground">Reseller: {payment.transaction.reseller.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{formatCurrency(payment.amount)}</Badge>
                      <Link href={`/admin/payments/${payment.id}`}>
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
                <CreditCard className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Tidak ada pembayaran yang menunggu persetujuan</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/admin/payments" className="w-full">
              <Button variant="outline" className="w-full">
                Lihat Semua Pembayaran
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tindakan Cepat</CardTitle>
            <CardDescription>Akses cepat ke fitur-fitur utama</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/admin/packages/create">
                <Button variant="outline" className="w-full">
                  <PackageIcon className="mr-2 h-4 w-4" />
                  Tambah Paket
                </Button>
              </Link>
              <Link href="/admin/resellers/create">
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Tambah Reseller
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Lihat Laporan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistik Pembayaran</CardTitle>
            <CardDescription>Ringkasan status pembayaran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Pembayaran Disetujui</span>
                </div>
                <Link href="/admin/payments?status=APPROVED">
                  <Button variant="ghost" size="sm">
                    Lihat
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Menunggu Persetujuan</span>
                </div>
                <Link href="/admin/payments?status=PENDING">
                  <Button variant="ghost" size="sm">
                    Lihat
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                  <span>Pembayaran Ditolak</span>
                </div>
                <Link href="/admin/payments?status=REJECTED">
                  <Button variant="ghost" size="sm">
                    Lihat
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


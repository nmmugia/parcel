"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, CreditCard, DollarSign, Percent, Users, CheckCircle, XCircle } from "lucide-react"

interface ResellerTransactionCount {
  resellerId: string
  resellerName: string
  count: number
}

interface ReportsOverviewProps {
  totalTransactions: number
  activeTransactions: number
  completedTransactions: number
  totalPayments: number
  approvedPayments: number
  rejectedPayments: number
  totalRevenue: number
  totalResellerBonus: number
  totalAdminBonus: number
  transactionsPerReseller: ResellerTransactionCount[]
}

export function ReportsOverview({
  totalTransactions,
  activeTransactions,
  completedTransactions,
  totalPayments,
  approvedPayments,
  rejectedPayments,
  totalRevenue,
  totalResellerBonus,
  totalAdminBonus,
  transactionsPerReseller,
}: ReportsOverviewProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          <TabsTrigger value="payments">Pembayaran</TabsTrigger>
          <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground">Jumlah transaksi yang dibuat</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Transaksi Aktif</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeTransactions}</div>
                <p className="text-xs text-muted-foreground">Jumlah transaksi yang sedang berjalan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Transaksi Selesai</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTransactions}</div>
                <p className="text-xs text-muted-foreground">Jumlah transaksi yang telah selesai</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaksi per Reseller</CardTitle>
              <CardDescription>Jumlah transaksi yang dibuat oleh setiap reseller</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsPerReseller.length > 0 ? (
                <div className="space-y-4">
                  {transactionsPerReseller.map((item) => (
                    <div key={item.resellerId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{item.resellerName}</span>
                      </div>
                      <span className="font-medium">{item.count} transaksi</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Belum ada data transaksi</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Pembayaran</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPayments}</div>
                <p className="text-xs text-muted-foreground">Jumlah pembayaran yang dibuat</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pembayaran Disetujui</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedPayments}</div>
                <p className="text-xs text-muted-foreground">Jumlah pembayaran yang disetujui</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pembayaran Ditolak</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rejectedPayments}</div>
                <p className="text-xs text-muted-foreground">Jumlah pembayaran yang ditolak</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Pembayaran</CardTitle>
              <CardDescription>Persentase pembayaran berdasarkan status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disetujui</span>
                    <span className="text-sm font-medium">
                      {totalPayments > 0 ? `${((approvedPayments / totalPayments) * 100).toFixed(1)}%` : "0%"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: totalPayments > 0 ? `${(approvedPayments / totalPayments) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ditolak</span>
                    <span className="text-sm font-medium">
                      {totalPayments > 0 ? `${((rejectedPayments / totalPayments) * 100).toFixed(1)}%` : "0%"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{
                        width: totalPayments > 0 ? `${(rejectedPayments / totalPayments) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Menunggu</span>
                    <span className="text-sm font-medium">
                      {totalPayments > 0
                        ? `${(((totalPayments - approvedPayments - rejectedPayments) / totalPayments) * 100).toFixed(1)}%`
                        : "0%"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-yellow-500"
                      style={{
                        width:
                          totalPayments > 0
                            ? `${((totalPayments - approvedPayments - rejectedPayments) / totalPayments) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">Pendapatan dari pembayaran yang disetujui</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Bonus Reseller</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalResellerBonus)}</div>
                <p className="text-xs text-muted-foreground">Bonus yang diberikan kepada reseller</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Bonus Admin</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalAdminBonus)}</div>
                <p className="text-xs text-muted-foreground">Bonus yang diberikan kepada admin</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribusi Pendapatan</CardTitle>
              <CardDescription>
                Distribusi pendapatan antara pendapatan bersih, bonus reseller, dan bonus admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pendapatan Bersih</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(totalRevenue - totalResellerBonus - totalAdminBonus)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width:
                          totalRevenue > 0
                            ? `${((totalRevenue - totalResellerBonus - totalAdminBonus) / totalRevenue) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bonus Reseller</span>
                    <span className="text-sm font-medium">{formatCurrency(totalResellerBonus)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: totalRevenue > 0 ? `${(totalResellerBonus / totalRevenue) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bonus Admin</span>
                    <span className="text-sm font-medium">{formatCurrency(totalAdminBonus)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-yellow-500"
                      style={{
                        width: totalRevenue > 0 ? `${(totalAdminBonus / totalRevenue) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { id } from "date-fns/locale"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatCurrency } from "@/lib/utils"

// Warna sampel untuk pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export function ReportsOverview() {
  const [timeFilter, setTimeFilter] = useState("all")
  const [reportType, setReportType] = useState("transactions")
  const [startDate, setStartDate] = useState<Date | undefined>(subMonths(new Date(), 1))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [transactionData, setTransactionData] = useState<any[]>([])
  const [userData, setUserData] = useState<any[]>([])
  const [paymentData, setPaymentData] = useState<any>({
    totalAmount: 0,
    approvedAmount: 0,
    pendingAmount: 0,
    lateApprovedAmount: 0,
    onTimeApprovedAmount: 0,
    waitingForPaymentAmount: 0,
    waitingForApprovalAmount: 0,
    rejectedAmount: 0,
    monthlyData: [],
    paymentStatusData: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true)
      try {
        // Tentukan rentang tanggal berdasarkan filter
        let start = startDate
        let end = endDate

        if (timeFilter === "current_month") {
          start = startOfMonth(new Date())
          end = endOfMonth(new Date())
        } else if (timeFilter === "previous_month") {
          const prevMonth = subMonths(new Date(), 1)
          start = startOfMonth(prevMonth)
          end = endOfMonth(prevMonth)
        }

        // Ambil data transaksi
        const transactionResponse = await fetch(
          `/api/reports/transactions?${start ? `startDate=${start.toISOString()}` : ""}${end ? `&endDate=${end.toISOString()}` : ""}`,
        )
        if (transactionResponse.ok) {
          const transactionData = await transactionResponse.json()
          setTransactionData(transactionData)
        }

        // Ambil data pengguna
        const userResponse = await fetch(
          `/api/reports/users?${start ? `startDate=${start.toISOString()}` : ""}${end ? `&endDate=${end.toISOString()}` : ""}`,
        )
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserData(userData)
        }

        // Ambil data pembayaran
        const paymentResponse = await fetch(
          `/api/reports/payments?${start ? `startDate=${start.toISOString()}` : ""}${end ? `&endDate=${end.toISOString()}` : ""}`,
        )
        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json()
          setPaymentData(paymentData)
        }
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error)
        // Gunakan data sampel untuk demonstrasi
        setTransactionData(sampleTransactionData)
        setUserData(sampleUserData)
        setPaymentData(samplePaymentData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReportData()
  }, [timeFilter, startDate, endDate])

  const handleDateChange = (type: "start" | "end", date?: Date) => {
    if (type === "start") {
      setStartDate(date)
    } else {
      setEndDate(date)
    }
    setTimeFilter("custom")
  }

  // Data sampel untuk demonstrasi
  const sampleTransactionData = [
    { name: "Minggu 1", amount: 4000 },
    { name: "Minggu 2", amount: 3000 },
    { name: "Minggu 3", amount: 2000 },
    { name: "Minggu 4", amount: 2780 },
    { name: "Minggu 5", amount: 1890 },
  ]

  const sampleUserData = [
    { name: "Aktif", value: 400 },
    { name: "Tidak Aktif", value: 300 },
    { name: "Baru", value: 300 },
    { name: "Dengan Pembayaran Terlambat", value: 200 },
    { name: "Eligible Bonus", value: 278 },
  ]

  const samplePaymentData = {
    totalAmount: 10000000,
    approvedAmount: 7500000,
    pendingAmount: 2500000,
    lateApprovedAmount: 1500000,
    onTimeApprovedAmount: 6000000,
    waitingForPaymentAmount: 1500000,
    waitingForApprovalAmount: 800000,
    rejectedAmount: 200000,
    monthlyData: [
      { name: "Jan", approved: 1000000, pending: 200000 },
      { name: "Feb", approved: 1200000, pending: 180000 },
      { name: "Mar", approved: 900000, pending: 300000 },
      { name: "Apr", approved: 1500000, pending: 150000 },
      { name: "Mei", approved: 1300000, pending: 220000 },
      { name: "Jun", approved: 1100000, pending: 280000 },
    ],
    paymentStatusData: [
      { name: "Disetujui (Tepat Waktu)", value: 6000000 },
      { name: "Disetujui (Terlambat)", value: 1500000 },
      { name: "Menunggu Pembayaran", value: 1500000 },
      { name: "Menunggu Persetujuan", value: 800000 },
      { name: "Ditolak", value: 200000 },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Laporan & Analitik</h2>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal sm:w-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP", { locale: id }) : "Tanggal Mulai"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => handleDateChange("start", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal sm:w-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP", { locale: id }) : "Tanggal Berakhir"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => handleDateChange("end", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="all" value={timeFilter} onValueChange={setTimeFilter} className="w-full">
        <TabsList className="w-full sm:w-auto flex flex-wrap h-auto min-h-10">
          <TabsTrigger value="all" className="whitespace-normal break-words">
            Semua Waktu
          </TabsTrigger>
          <TabsTrigger value="current_month" className="whitespace-normal break-words">
            Bulan Ini
          </TabsTrigger>
          <TabsTrigger value="previous_month" className="whitespace-normal break-words">
            Bulan Lalu
          </TabsTrigger>
          <TabsTrigger value="custom" className="whitespace-normal break-words">
            Rentang Kustom
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs defaultValue="transactions" value={reportType} onValueChange={setReportType} className="w-full">
        <TabsList className="w-full sm:w-auto flex flex-wrap h-auto min-h-10">
          <TabsTrigger value="transactions" className="whitespace-normal break-words">
            Transaksi
          </TabsTrigger>
          <TabsTrigger value="users" className="whitespace-normal break-words">
            Pengguna
          </TabsTrigger>
          <TabsTrigger value="payments" className="whitespace-normal break-words">
            Pembayaran
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ikhtisar Transaksi</CardTitle>
              <CardDescription>Lihat data transaksi untuk periode waktu yang dipilih</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Memuat data transaksi...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={transactionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="amount" fill="#8884d8" name="Jumlah Transaksi" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ikhtisar Pengguna</CardTitle>
              <CardDescription>Lihat statistik pengguna untuk periode waktu yang dipilih</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Memuat data pengguna...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ikhtisar Pembayaran</CardTitle>
              <CardDescription>Lihat statistik pembayaran untuk periode waktu yang dipilih</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Rincian Status Pembayaran */}
                <div className="h-[400px]">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <p>Memuat data pembayaran...</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium mb-4">Rincian Status Pembayaran</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                          <Pie
                            data={paymentData.paymentStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {paymentData.paymentStatusData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </>
                  )}
                </div>

                {/* Tren Pembayaran Bulanan */}
                <div className="h-[400px]">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <p>Memuat data pembayaran...</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium mb-4">Tren Pembayaran Bulanan</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <LineChart
                          data={paymentData.monthlyData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="approved"
                            stroke="#8884d8"
                            name="Pembayaran Disetujui"
                            activeDot={{ r: 8 }}
                          />
                          <Line type="monotone" dataKey="pending" stroke="#82ca9d" name="Pembayaran Tertunda" />
                        </LineChart>
                      </ResponsiveContainer>
                    </>
                  )}
                </div>
              </div>

              {/* Kartu Ringkasan Pembayaran */}
              <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pembayaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(paymentData.totalAmount)}</div>
                    <p className="text-xs text-muted-foreground">100% dari semua pembayaran</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pembayaran Disetujui</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(paymentData.approvedAmount)}</div>
                    <p className="text-xs text-muted-foreground">
                      {paymentData.totalAmount
                        ? `${((paymentData.approvedAmount / paymentData.totalAmount) * 100).toFixed(1)}% dari total`
                        : "0% dari total"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pembayaran Tertunda</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(paymentData.pendingAmount)}</div>
                    <p className="text-xs text-muted-foreground">
                      {paymentData.totalAmount
                        ? `${((paymentData.pendingAmount / paymentData.totalAmount) * 100).toFixed(1)}% dari total`
                        : "0% dari total"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pembayaran Terlambat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(paymentData.lateApprovedAmount)}</div>
                    <p className="text-xs text-muted-foreground">
                      {paymentData.approvedAmount
                        ? `${((paymentData.lateApprovedAmount / paymentData.approvedAmount) * 100).toFixed(1)}% dari yang disetujui`
                        : "0% dari yang disetujui"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Rincian Pembayaran Detail */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Rincian Pembayaran Detail</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Pembayaran Disetujui</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Tepat Waktu:</span>
                          <span className="font-medium">{formatCurrency(paymentData.onTimeApprovedAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Terlambat:</span>
                          <span className="font-medium">{formatCurrency(paymentData.lateApprovedAmount)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Total Disetujui:</span>
                          <span className="font-bold">{formatCurrency(paymentData.approvedAmount)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Pembayaran Tertunda</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Menunggu Pembayaran:</span>
                          <span className="font-medium">{formatCurrency(paymentData.waitingForPaymentAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Menunggu Persetujuan:</span>
                          <span className="font-medium">{formatCurrency(paymentData.waitingForApprovalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Ditolak:</span>
                          <span className="font-medium">{formatCurrency(paymentData.rejectedAmount)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Total Tertunda:</span>
                          <span className="font-bold">{formatCurrency(paymentData.pendingAmount)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(paymentData.approvedAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentData.totalAmount
                ? `${((paymentData.approvedAmount / paymentData.totalAmount) * 100).toFixed(1)}% dari pendapatan yang diharapkan`
                : "0% dari pendapatan yang diharapkan"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reseller Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.find((item: any) => item.name === "Aktif")?.value || 0}</div>
            <p className="text-xs text-muted-foreground">
              {userData.length > 0
                ? `${(
                    ((userData.find((item: any) => item.name === "Aktif")?.value || 0) /
                      userData.reduce((sum: number, item: any) => sum + item.value, 0)) *
                      100
                  ).toFixed(1)}% dari semua reseller`
                : "0% dari semua reseller"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"

interface PaymentFilterProps {
  onFilterChange: (filters: {
    status: string
    sortBy: string
    sortOrder: "asc" | "desc"
    groupBy: string
  }) => void
}

export function PaymentFilter({ onFilterChange }: PaymentFilterProps) {
  const [status, setStatus] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [groupBy, setGroupBy] = useState("none")

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onFilterChange({ status: value, sortBy, sortOrder, groupBy })
  }

  const handleSortByChange = (value: string) => {
    setSortBy(value)
    onFilterChange({ status, sortBy: value, sortOrder, groupBy })
  }

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value)
    onFilterChange({ status, sortBy, sortOrder: value, groupBy })
  }

  const handleGroupByChange = (value: string) => {
    setGroupBy(value)
    onFilterChange({ status, sortBy, sortOrder, groupBy: value })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Status</h4>
            <RadioGroup defaultValue={status} onValueChange={handleStatusChange} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">Semua</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="WAITING_FOR_PAYMENT" id="waiting-payment" />
                <Label htmlFor="waiting-payment">Menunggu Pembayaran</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="WAITING_FOR_APPROVAL" id="waiting-approval" />
                <Label htmlFor="waiting-approval">Menunggu Persetujuan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="APPROVED" id="approved" />
                <Label htmlFor="approved">Disetujui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="REJECTED" id="rejected" />
                <Label htmlFor="rejected">Ditolak</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Urutkan Berdasarkan</h4>
            <RadioGroup defaultValue={sortBy} onValueChange={handleSortByChange} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dueDate" id="dueDate" />
                <Label htmlFor="dueDate">Tanggal Jatuh Tempo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paidDate" id="paidDate" />
                <Label htmlFor="paidDate">Tanggal Bayar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amount" id="amount" />
                <Label htmlFor="amount">Jumlah</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Urutan</h4>
            <RadioGroup
              defaultValue={sortOrder}
              onValueChange={(value) => handleSortOrderChange(value as "asc" | "desc")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="asc" />
                <Label htmlFor="asc">Naik (A-Z, Terlama)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="desc" />
                <Label htmlFor="desc">Turun (Z-A, Terbaru)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Kelompokkan Berdasarkan</h4>
            <RadioGroup defaultValue={groupBy} onValueChange={handleGroupByChange} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">Tidak Ada</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="month" />
                <Label htmlFor="month">Bulan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="status" id="status-group" />
                <Label htmlFor="status-group">Status</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}


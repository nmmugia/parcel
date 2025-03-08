"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Package, PackageType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { IconDisplay } from "@/components/icon-display"
import { PackageIcon, Search } from "lucide-react"

interface PackageWithType extends Package {
  packageType: PackageType
}

interface PackageCatalogProps {
  packages: PackageWithType[]
  packageTypes: PackageType[]
}

export function PackageCatalog({ packages, packageTypes }: PackageCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Filter berdasarkan pencarian
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.packageType.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter berdasarkan tab
      const matchesTab = activeTab === "all" || pkg.packageTypeId === activeTab

      return matchesSearch && matchesTab
    })
  }, [packages, searchQuery, activeTab])

  if (packages.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <PackageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-center">Belum ada paket tersedia</p>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Silakan hubungi admin untuk informasi lebih lanjut
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari paket..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all" className="flex-1 md:flex-none">
              Semua
            </TabsTrigger>
            {packageTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="flex-1 md:flex-none">
                <IconDisplay icon={type.icon} className="mr-1 h-4 w-4" />
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filteredPackages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center">Tidak ada paket yang sesuai</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconDisplay icon={pkg.packageType.icon} className="h-5 w-5" />
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                </div>
                {pkg.description && <CardDescription className="mt-2 line-clamp-2">{pkg.description}</CardDescription>}
              </CardHeader>
              <CardContent className="pb-3 flex-grow">
                <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                  {pkg.imageUrl ? (
                    <Image src={pkg.imageUrl || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <PackageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga Total:</span>
                    <span className="font-medium">{formatCurrency(pkg.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tenor:</span>
                    <span className="font-medium">{pkg.tenorMonths} bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cicilan per Bulan:</span>
                    <span className="font-medium">{formatCurrency(pkg.monthlyAmount)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <Link href={`/reseller/packages/${pkg.id}`} className="w-full">
                  <Button className="w-full">Lihat Detail</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Cek apakah sudah ada data
    const adminCount = await db.user.count({
      where: {
        role: "ADMIN",
      },
    })

    if (adminCount > 0) {
      return NextResponse.json({ message: "Database sudah terisi data" })
    }

    // Buat admin
    const adminPassword = await hash("admin123", 10)
    await db.user.create({
      data: {
        name: "Admin",
        email: "admin@example.com",
        password: adminPassword,
        role: "ADMIN",
      },
    })

    // Buat reseller
    const resellerPassword = await hash("reseller123", 10)
    await db.user.create({
      data: {
        name: "Reseller Demo",
        email: "reseller@example.com",
        password: resellerPassword,
        role: "RESELLER",
      },
    })

    // Buat jenis paket
    const moneyPackageType = await db.packageType.create({
      data: {
        name: "Paket Uang",
        description: "Paket pinjaman uang dengan cicilan",
        icon: "Banknote",
      },
    })

    const foodPackageType = await db.packageType.create({
      data: {
        name: "Paket Makanan",
        description: "Paket makanan dengan cicilan",
        icon: "Utensils",
      },
    })

    // Buat paket
    await db.package.create({
      data: {
        name: "Paket Uang 10 Juta",
        description: "Paket pinjaman uang 10 juta dengan cicilan 12 bulan",
        price: 10000000,
        tenorMonths: 12,
        monthlyAmount: 1000000,
        packageTypeId: moneyPackageType.id,
      },
    })

    await db.package.create({
      data: {
        name: "Paket Makanan Bulanan",
        description: "Paket makanan bulanan dengan cicilan 6 bulan",
        price: 3000000,
        tenorMonths: 6,
        monthlyAmount: 500000,
        packageTypeId: foodPackageType.id,
      },
    })

    // Buat pengaturan bonus
    await db.setting.create({
      data: {
        key: "bonus_rates",
        value: JSON.stringify({
          resellerBonusRate: 0.05,
          adminBonusRate: 0.05,
        }),
      },
    })

    return NextResponse.json({ message: "Database berhasil diisi dengan data awal" })
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat mengisi database" }, { status: 500 })
  }
}


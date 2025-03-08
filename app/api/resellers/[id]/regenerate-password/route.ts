import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { hash } from "bcrypt"
import { generatePassword } from "@/lib/utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Periksa apakah reseller ada
    const existingReseller = await db.user.findUnique({
      where: {
        id: params.id,
        role: "RESELLER",
      },
    })

    if (!existingReseller) {
      return NextResponse.json({ error: "Reseller tidak ditemukan" }, { status: 404 })
    }

    // Generate password baru
    const password = generatePassword(8)
    const hashedPassword = await hash(password, 10)

    await db.user.update({
      where: {
        id: params.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({ password })
  } catch (error) {
    console.error("Error regenerating password:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengatur ulang password" }, { status: 500 })
  }
}


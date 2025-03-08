import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { hash } from "bcrypt"
import { z } from "zod"
import { generatePassword } from "@/lib/utils"

const resellerSchema = z.object({
  name: z.string().min(1, "Nama reseller wajib diisi"),
  email: z.string().email("Email tidak valid"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = resellerSchema.parse(body)

    // Periksa apakah email sudah digunakan
    const existingUser = await db.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 })
    }

    // Generate password
    const password = generatePassword(8)
    const hashedPassword = await hash(password, 10)

    const reseller = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "RESELLER",
      },
    })

    // Hapus password dari response
    const { password: _, ...resellerWithoutPassword } = reseller

    return NextResponse.json({
      ...resellerWithoutPassword,
      password,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    console.error("Error creating reseller:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat reseller" }, { status: 500 })
  }
}


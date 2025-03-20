import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { hash } from "bcrypt"
import { z } from "zod"

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
    const password = "123456"
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

    return NextResponse.json({ error: "Terjadi kesalahan saat membuat reseller", details: error }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resellers = await db.user.findMany({
      where: {
        role: "RESELLER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(resellers)
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil reseller", details: error }, { status: 500 })
  }
}


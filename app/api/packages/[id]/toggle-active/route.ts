import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const toggleActiveSchema = z.object({
  isActive: z.boolean(),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { isActive } = toggleActiveSchema.parse(body)

    const packageData = await db.package.update({
      where: {
        id: params.id,
      },
      data: {
        isActive,
      },
    })

    return NextResponse.json(packageData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
    }

    console.error("Error toggling package active status:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengubah status paket" }, { status: 500 })
  }
}


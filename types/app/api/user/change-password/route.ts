import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { compare, hash } from "bcrypt"
import { z } from "zod"

const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = passwordChangeSchema.parse(body)

        // Get the user from the database
        const user = await db.user.findUnique({
            where: {
                id: session.user.id,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
        }

        // Verify current password
        const isPasswordValid = await compare(validatedData.currentPassword, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Password saat ini tidak valid" }, { status: 400 })
        }

        // Hash the new password
        const hashedPassword = await hash(validatedData.newPassword, 10)

        // Update the user's password
        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                password: hashedPassword,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validasi gagal", details: error.errors }, { status: 400 })
        }

        console.error("Error changing password:", error)
        return NextResponse.json({ error: "Terjadi kesalahan saat mengubah password" }, { status: 500 })
    }
}


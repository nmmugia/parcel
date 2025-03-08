import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadToS3 } from "@/lib/s3"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    // Konversi File ke Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload ke S3
    const fileUrl = await uploadToS3(buffer, file.name)

    // Kirim email dengan lampiran
    await sendEmailWithAttachment(session.user.email, session.user.name, file.name, buffer, fileUrl)

    return NextResponse.json({ fileUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengunggah file" }, { status: 500 })
  }
}

async function sendEmailWithAttachment(
  userEmail: string,
  userName: string,
  fileName: string,
  fileBuffer: Buffer,
  fileUrl: string,
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `"Sistem Paket" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Bukti Pembayaran dari ${userName}`,
    text: `Bukti pembayaran telah diunggah oleh ${userName} (${userEmail}).\n\nURL File: ${fileUrl}`,
    html: `
      <h2>Bukti Pembayaran</h2>
      <p>Bukti pembayaran telah diunggah oleh ${userName} (${userEmail}).</p>
      <p>URL File: <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>
    `,
    attachments: [
      {
        filename: fileName,
        content: fileBuffer,
      },
    ],
  })
}


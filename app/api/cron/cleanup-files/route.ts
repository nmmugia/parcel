import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { promisify } from "util"

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const unlink = promisify(fs.unlink)

// Fungsi untuk membersihkan file yang lebih dari 3 hari
export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads")

    // Pastikan direktori ada
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({ message: "Direktori uploads tidak ditemukan" })
    }

    const files = await readdir(uploadsDir)
    const now = new Date()
    let deletedCount = 0

    for (const file of files) {
      const filePath = path.join(uploadsDir, file)
      const fileStat = await stat(filePath)

      // Hitung selisih waktu dalam hari
      const fileAge = (now.getTime() - fileStat.mtime.getTime()) / (1000 * 60 * 60 * 24)

      // Hapus file yang lebih dari 3 hari
      if (fileAge > 3) {
        await unlink(filePath)
        deletedCount++
      }
    }

    return NextResponse.json({
      message: `Berhasil membersihkan ${deletedCount} file yang lebih dari 3 hari`,
    })
  } catch (error) {
    console.error("Error cleaning up files:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membersihkan file" }, { status: 500 })
  }
}


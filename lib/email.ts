import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  try {
    const info = await transporter.sendMail({
      from: `"Paket Reseller" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
    })

    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
<<<<<<< HEAD
    console.error("Error sending email:", error)
=======
>>>>>>> feature/package-management
    return { success: false, error }
  }
}

<<<<<<< HEAD
=======

interface PaymentApprovalEmailOptions {
  to: string
  resellerName: string
  paymentAmount: number
  paymentDate: Date | null
  dueDate: Date
  transactionId: string
  packageName: string
}

export async function sendPaymentApprovalEmail({
  to,
  resellerName,
  paymentAmount,
  paymentDate,
  dueDate,
  transactionId,
  packageName,
}: PaymentApprovalEmailOptions) {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(paymentAmount)

  const formattedPaymentDate = paymentDate?.toLocaleDateString("id-ID")
  const formattedDueDate = dueDate.toLocaleDateString("id-ID")

  const html = `
    <h1>Pembayaran Disetujui</h1>
    <p>Halo ${resellerName},</p>
    <p>Pembayaran Anda sebesar <strong>${formattedAmount}</strong> untuk cicilan tanggal <strong>${formattedDueDate}</strong> telah disetujui.</p>
    <p>Detail Pembayaran:</p>
    <ul>
      <li>Paket: ${packageName}</li>
      <li>Jumlah: ${formattedAmount}</li>
      <li>Tanggal Pembayaran: ${formattedPaymentDate}</li>
      <li>Transaksi ID: ${transactionId}</li>
    </ul>
    <p>Terima kasih!</p>
  `

  return sendEmail({
    to,
    subject: "Pembayaran Disetujui",
    html,
  })
}
>>>>>>> feature/package-management

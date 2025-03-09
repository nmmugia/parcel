import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isResellerRoute = request.nextUrl.pathname.startsWith("/reseller")
  const isAuthRoute = request.nextUrl.pathname === "/"

  // Jika pengguna tidak terautentikasi dan mencoba mengakses rute yang dilindungi
  if (!isAuthenticated && (isAdminRoute || isResellerRoute)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Jika pengguna terautentikasi dan mencoba mengakses rute autentikasi
  if (isAuthenticated && isAuthRoute) {
    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } else if (token.role === "RESELLER") {
      return NextResponse.redirect(new URL("/reseller/dashboard", request.url))
    }
  }

  // Jika admin mencoba mengakses rute reseller
  if (isAuthenticated && token.role === "ADMIN" && isResellerRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  // Jika reseller mencoba mengakses rute admin
  if (isAuthenticated && token.role === "RESELLER" && isAdminRoute) {
    return NextResponse.redirect(new URL("/reseller/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/admin/:path*", "/reseller/:path*"],
}


import { NextResponse } from "next/server"

const AUTH_COOKIE = "aloha-login-verified"

export function proxy(request) {
  const { pathname } = request.nextUrl
  const isVerified = request.cookies.get(AUTH_COOKIE)?.value === "true"

  if (pathname === "/" && !isVerified) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (pathname === "/login" && isVerified) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login"],
}

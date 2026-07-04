import { NextResponse } from "next/server"

export function proxy(request) {
  const session = request.cookies.get("session")?.value
  const pathname = request.nextUrl.pathname

  if (pathname === "/" && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login"],
}
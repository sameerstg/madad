import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./auth"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public access to the sign-in page
  if (pathname === "/signin") {
    return NextResponse.next()
  }

  const session = await auth()

  // Redirect to sign-in if no session and trying to access protected route
  if (!session) {
    const signInUrl = new URL("/sign-in", req.url)
    return NextResponse.redirect(signInUrl)
  }

  // User is authenticated
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard"], // Customize this
}
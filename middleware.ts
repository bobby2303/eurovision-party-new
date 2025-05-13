import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware checks if the user is authenticated
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes (e.g., homepage, login, etc.)
  const publicRoutes = ["/"]
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get("eurovisionUser")?.value

  if (!token) { 
    // Redirect unauthenticated users to the homepage
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Apply middleware to all routes except static files
}
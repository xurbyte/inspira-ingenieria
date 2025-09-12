import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET as string

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl

  // Rutas que requieren auth
  const protectedPaths = ['/admin/dashboard', '/admin/projects', '/api/projects']

  if (protectedPaths.some(p => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    try {
      jwt.verify(token, SECRET)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/projects/:path*'],
}

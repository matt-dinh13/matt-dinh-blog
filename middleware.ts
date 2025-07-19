import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_LANGS = ['vi', 'en']
const PUBLIC_PREFIXES = ['blog', 'portfolio', 'about', 'search', 'tag']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Redirect / to /vi
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/vi'
    return NextResponse.redirect(url)
  }

  // 2. Redirect legacy URLs to /vi/...
  // e.g., /blog/slug, /portfolio/slug, /about, /blog, /portfolio, etc.
  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length > 0 && !PUBLIC_LANGS.includes(pathParts[0])) {
    // Only redirect if not /admin or /api
    if (pathParts[0] === 'admin' || pathParts[0] === 'api') {
      return NextResponse.next()
    }
    // If matches a public prefix, redirect to /vi/... (preserve rest of path)
    if (PUBLIC_PREFIXES.includes(pathParts[0])) {
      const url = request.nextUrl.clone()
      url.pathname = '/vi' + pathname
      return NextResponse.redirect(url)
    }
  }

  // 3. Allow /vi and /en as parallel structures for all public pages
  // (No redirect needed, just allow through)
  if (pathParts.length > 0 && PUBLIC_LANGS.includes(pathParts[0])) {
    return NextResponse.next()
  }

  // 4. Allow /admin and /api through
  if (pathParts[0] === 'admin' || pathParts[0] === 'api') {
    return NextResponse.next()
  }

  // 5. Fallback: next
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply to all routes except static files, _next, etc.
    '/((?!_next|static|favicon.ico|logo.png|logo-square.jpg|covers|vercel.svg|api/auth).*)',
  ],
} 
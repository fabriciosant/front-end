//src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const currentPath = url.pathname;
  
  const isProtectedRoute = currentPath.startsWith('/dashboard');
  
  const accessToken = request.cookies.get('access_token')?.value;
  const userData = request.cookies.get('user')?.value;
  const isAuthenticated = !!(accessToken && userData);

  console.log(`🛡️ Middleware - Rota: ${url}, Autenticado: ${isAuthenticated}`);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && currentPath !== '/confirmation') {
    if (currentPath === '/' || currentPath === '/' || currentPath === '/') {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
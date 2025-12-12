// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verifica se a rota é protegida (starts with /dashboard)
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  
  // Verifica se o usuário está autenticado
  const accessToken = request.cookies.get('access_token')?.value;
  const userData = request.cookies.get('user')?.value;
  
  const isAuthenticated = !!(accessToken && userData);

  // Se está tentando acessar rota protegida sem autenticação
  if (isProtectedRoute && !isAuthenticated) {
    // Redireciona para login
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se está autenticado e tentando acessar login/register
  if (isAuthenticated && (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/')) {
    // Redireciona para dashboard
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Configura para quais rotas o middleware será executado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
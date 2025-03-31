import { NextResponse } from 'next/server';
import { parseCookies } from 'nookies';

export function middleware(req) {
  // Get cookies from the request to check if the user is authenticated
  const cookies = parseCookies({ req });
  const user = cookies.user; // Assuming you store user data in cookies after login

  // Get the current page path
  const path = req.nextUrl.pathname;

  // Allow access to login and signup pages
  if (path === '/login' || path === '/signup') {
    return NextResponse.next();
  }

  // If the user is not authenticated and is trying to access a protected page, redirect to login
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/*', '/profile', '/admin/*', '/subadmin/*', '/posts/*', '/create/*'],
};

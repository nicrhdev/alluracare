import { NextRequest, NextResponse } from 'next/server';
 
// List of supported locales
const locales = ['fa', 'en'];
const defaultLocale = 'fa';
 
export function proxy(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname has a valid locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (!pathnameHasLocale) {
    // Redirect to the default locale
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }
  
  // If the locale is valid, continue
  const response = NextResponse.next();
  
  // Set a cookie to remember the user's locale preference
  // This helps with consistent behavior across requests
  const locale = pathname.split('/')[1];
  response.cookies.set('NEXT_LOCALE', locale);
  
  console.log('🌍 Proxy - Setting locale:', locale);
  
  return response;
}
 
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
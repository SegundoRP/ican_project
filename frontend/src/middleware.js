import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
 
let headers = { 'accept-language': 'es,es;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['es', 'en']
let defaultLocale = 'es'
 
 

export function middleware(request) {

  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 

  const locale = match(languages, locales, defaultLocale)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return Response.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    '/((?!_next).*)',
  ],
}
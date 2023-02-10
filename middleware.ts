import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const cookie = request.cookies.has('auth-token')

  // learner 페이지나 teacher 페이지에서 auth-token cookie 가 없다면, 로그인 페이지로 이동
  if (
    !cookie &&
    (request.nextUrl.pathname.startsWith('/learner') ||
      request.nextUrl.pathname.startsWith('/teacher'))
  ) {
    return NextResponse.redirect(new URL('https://fiive.me/login', request.url))
  }
}

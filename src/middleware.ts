import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = ['/login'];

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    console.log('パス', pathname);
    console.log('公開ページへのアクセスです。ミドルウェアをスキップします。');
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    console.log('リダイレクトする');
    //   return NextResponse.redirect(new URL('/login', req.url));
  }

  // console.log('トークンが有効です。リクエストを続行します。');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login).*)'],
};

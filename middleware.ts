import { NextRequest, NextResponse } from "next/server";

import firebase_app from "./firebase";
import { auth, functions, database, storage } from "./firebase";

export function middleware(request: NextRequest) {
  if (auth.currentUser == null && request.nextUrl.pathname != '/login') {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }
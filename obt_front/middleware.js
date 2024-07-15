import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(request) {
  // const currentUser = await auth();

  // if (currentUser && request.nextUrl.pathname.startsWith("/login")) {
  //   return Response.redirect(new URL("/profile", request.url));
  // }

  // if (!currentUser && request.nextUrl.pathname.startsWith("/profile")) {
  //   return Response.redirect(new URL("/login", request.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

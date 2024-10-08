import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");

  const publicPaths = ["/auth/login", "/auth/register", "/public"];

  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/logout") {
    // Clear access token cookie
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.set("access_token", "", { maxAge: -1 });
    return response;
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};

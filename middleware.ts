import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // REMEMBER :- JWT tokens do not work in nextjs middleware

const publicRoutes = ["/landing", "/auth/sign-in", "/auth/sign-up", "/auth/verify-email", "/auth/forgot-password", "/auth/resend-email"];

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  
  // If it's a public route
  if (publicRoutes.includes(pathname)) {
    if (accessToken) {
      try {
        jwtVerify(accessToken, JWT_SECRET);
        return NextResponse.redirect(new URL("/", request.url));
      } catch (err) {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }
  // For protected routes
  if (!accessToken) {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/landing", request.url));
    }
    try {
      await jwtVerify(refreshToken, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      console.error("Invalid refreshToken")
      return NextResponse.redirect(new URL("/landing", request.url));
    }
  }

  try {
    await jwtVerify(accessToken!, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/landing", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|static).*)"],
};

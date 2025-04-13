import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // REMEMBER :- JWT tokens do not work in nextjs middleware

const publicRoutes = ["/", "/auth/sign-in", "/auth/sign-up"];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // If it's a public route
  if (publicRoutes.includes(pathname)) {
    if (token) {
      try {
        jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (err) {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }
  // For protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/", 
    "/auth/sign-in", 
    "/auth/sign-up", 
    "/dashboard/:path*", 
    "/profile/:path*"], // 👈 protected routes
};

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const publicRoutes = ["/", "/auth/sign-in", "/auth/sign-up"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // allow public routes
    if(publicRoutes.includes(pathname)) return NextResponse.next();

    const token = request.cookies.get("access_token")?.value;

    if(!token){
        return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        // You can also attach user info to request if needed
        return NextResponse.next();
    } catch (err) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'], // 👈 protected routes
};
  
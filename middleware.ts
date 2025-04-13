import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // REMEMBER :- JWT tokens do not work in nextjs middleware
 
const publicRoutes = ["/", "/auth/sign-in", "/auth/sign-up"];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // allow public routes
    if(publicRoutes.includes(pathname)) return NextResponse.next();

    const token = request.cookies.get("accessToken")?.value;
    console.log("Cookies:", request.cookies.get("accessToken")?.value);

    if(!token){
        return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    };

    try {
        await jwtVerify(token, JWT_SECRET);
        // You can also attach user info to request if needed
        return NextResponse.next();
    } catch (err) {
        console.error("JWT error:", err);
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'], // 👈 protected routes
};
  
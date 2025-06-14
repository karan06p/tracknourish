import { connectToDB } from "@/db/connectDb";
import { ApiResponse } from "@/lib/utils";
import { User } from "@/schema/UserSchema";
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

interface VerifyEmailParam{
    token : string;
}

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
const isProd = process.env.NODE_ENV === "production"

export async function POST(req: NextRequest) {
    connectToDB()
    try {
        const { token }: VerifyEmailParam = await req.json();
        if(!token) return ApiResponse(400, "Verification token is needed");

        const payload = jwt.verify(token, JWT_SECRET) as { email: string };
          if (!payload || !payload.email) {
          return ApiResponse(400, "Verification code expired");
          }

        const { email } = payload;

        if (!email) {
            return ApiResponse(400, "Verification code expired")
        }

         // find user
        const user = await User.findOne({ email });
          if(!user){
            return ApiResponse(404, "User not found")
          }

        if(user.isEmailVerified){
            return ApiResponse(200, "Email already verified");
        }

      // Create access and refresh tokens
      const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
  
      const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "15d",
      });
  
      // Create response with cookies
      const response = NextResponse.json({ message: "Email Verified" }, { status: 200 });
  
      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 1 * 60 * 60, // 1 hour
      });
  
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 10 * 24 * 60 * 60, // 10 days
      });  


        user.refreshToken = refreshToken;
        user.isEmailVerified = true;
        await user.save()

        
        return response;
    } catch (error) {
        console.error("Error in verifying email", error);
        return ApiResponse(500, "Error in verifying")
    }
}
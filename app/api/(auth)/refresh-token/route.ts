import { connectToDB } from "@/db/connectDb";
import { ApiResponse } from "@/lib/utils";
import { User } from "@/schema/UserSchema";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET!;
const isProd = process.env.NODE_ENV === "production";

export async function GET(req: NextRequest){
    connectToDB()
    try {
        const refreshToken = req.cookies.get("refreshToken")?.value;
        if(!refreshToken) return ApiResponse(401, "No refresh token found");

        const payload = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
        const user = await User.findById(payload.userId);
        if (!user) {
            return ApiResponse(403, "User not found");``
        }
          
        // if (user.refreshToken !== refreshToken) {
        //     console.warn("Mismatch between user DB refresh token and browser one");
        //     return ApiResponse(403, "Invalid refresh token");
        // }  

        // create new tokens
        const newAccessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        })
            // create a new refresh token also for refreshToken rotation (google it)
        const newRefreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "15d"
        })

        const res = NextResponse.json({ message: "Tokens refreshed" }, { status: 200 });

        res.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: isProd, 
            sameSite: "lax",
            path: "/",
            maxAge: 1 * 60 * 60, // 1 hour
          });
      
          res.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
            maxAge: 10 * 24 * 60 * 60, // 10 days
          });

        user.refreshToken = newRefreshToken;
        await user.save(); 

        return res;
    } catch (error) {
        console.error("Error in refreshing token", error);
        return ApiResponse(403, "Token is expired or invalid");
    }
} 
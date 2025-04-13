import { connectToDB } from "@/db/connectDb";
import { ApiResponse } from "@/lib/utils";
import { User } from "@/schema/UserSchema";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";


const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest){
    connectToDB()
    try {
        const refreshToken = await req.cookies.get("refreshToken")?.value;
        if(!refreshToken) return ApiResponse(401, "No refresh token found");

        const payload = await jwt.verify(refreshToken, JWT_SECRET) as { email: string };
        const user = await User.findOne({ email: payload.email });
        if(!user || user.refreshToken !== refreshToken ) {
            return ApiResponse(403, "Invalid refresh token");
        }    

        // create new tokens
        const newAccessToken = jwt.sign({ email: payload.email }, JWT_SECRET, {
            expiresIn: "1h",
        })
            // create a new refresh token also for refreshToken rotation (google it)
        const newRefreshToken = jwt.sign({ email: payload.email }, JWT_SECRET, {
            expiresIn: "15d"
        })

        const response = ApiResponse(200, "Tokens refreshed")

        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            // secure: true, // uncomment for production
            sameSite: "strict",
            path: "/",
            maxAge: 1 * 60 * 60, // 1 hour
          });
      
          response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            // secure: true, // uncomment for production
            sameSite: "strict",
            path: "/",
            maxAge: 10 * 24 * 60 * 60, // 10 days
          });

        user.refreshToken = newRefreshToken;
        await user.save();  

        return response
    } catch (error) {
        console.error("Error in refreshing token", error);
        return ApiResponse(403, "Token is expired or invalid");
    }
} 
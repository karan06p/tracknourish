import { connectToDB } from "@/db/connectDb";
import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/schema/UserSchema";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest){
    connectToDB()
    try {
       const token = req.cookies.get("accessToken")?.value;
       if(!token) return ApiResponse(401, "Not Authenticated");
       try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await User.findById(payload.userId).select("-hashedPassword -refreshToken");
        if (!user) return ApiResponse(404, "User not found");
        console.log(user)
        return NextResponse.json(user, { status: 200 });
       } catch (error) {
        
       }
    } catch (error) {
        console.error("Error while giving user-info", error);
        return ApiResponse(403, "Invalid token")
    }
}
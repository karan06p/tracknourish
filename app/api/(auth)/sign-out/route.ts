import { ApiResponse } from "@/lib/utils";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/db/connectDb";
import { User } from "@/schema/UserSchema";

const jwtSecret = process.env.JWT_SECRET!;

export async function GET(req: NextRequest){
    connectToDB()
    try {
        const accessToken = req.cookies.get("accessToken")?.value;
        if(!accessToken) return ApiResponse(400, "No access token found");
    
        const payload = jwt.verify(accessToken, jwtSecret) as { userId: string };
        const user = await User.findById(payload.userId);

        if(!user) return ApiResponse(404, "User not found");

        const res = ApiResponse(200, "User signed out");
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");

        user.refreshToken = ""
        await user.save();

        return res;
    } catch (error) {
        console.error("Error in signing out", error);
        return ApiResponse(400, "Error in signing user out");
    }

}
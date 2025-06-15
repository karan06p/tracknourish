import { ApiResponse } from "@/lib/utils";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET!;

export async function POST(req: NextRequest){
    try {
        const { otp } = await req.json();
        if(!otp) return ApiResponse(400, "Otp parameter not found");
    
        const verificationToken =  req.cookies.get("verificationToken")?.value;
        if(!verificationToken) return ApiResponse(400, "Verification Token not found");
    
        const payload = jwt.verify(verificationToken, jwtSecret) as { otp: string };
        if(!payload || !payload.otp) return ApiResponse(400, "Otp not found in the token");
    
        if(otp === payload.otp) {
            return ApiResponse(200, "Otp Verified")
        }else{
            return ApiResponse(400, "Otp is incorrect")
        }
    } catch (error) {
        return ApiResponse(500, "Internal error occured while verifying OTP")
    }
}
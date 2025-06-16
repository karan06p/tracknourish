import { ApiResponse } from "@/lib/utils";
import { User } from "@/schema/UserSchema";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import dotenv from "dotenv";
import OtpEmailTemplate from "@/components/OtpEmailTemplate";
import { connectToDB } from "@/db/connectDb";
import jwt from "jsonwebtoken"
import { RateLimiterMemory } from "rate-limiter-flexible";

dotenv.config();
const resendApiKey = process.env.RESEND_API_KEY!;
const jwtSecret = process.env.JWT_SECRET!;
const isProd = process.env.NODE_ENV === "production"

const resend = new Resend(resendApiKey);

const rateLimiter = new RateLimiterMemory({
  points: 2,
  duration: 120,
});

export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    connectToDB()
  try {
    const { email } = await req.json();
    if (!email) return ApiResponse(400, "Email parameter not found");
  
    const user = await User.findOne({email});
    if (!user) return ApiResponse(404, "User not found");
    if(!user.isEmailVerified) return ApiResponse(401, "Verify your email first")
  
    const firstName = user.userDetails.firstName;
    const otp = crypto.randomInt(100000, 1000000).toString();

    const token = jwt.sign({ otp }, jwtSecret, {
        expiresIn: "10m"
    })

    try {
    await rateLimiter.consume(ip, 2);
  } catch (rateError) {
    console.error("Rate Limiter Error:", rateError)
    return ApiResponse(429, "Too many requests. Please try again later.");
  }
  
    try {
      await resend.emails.send({
        from: "Tracknourish <noreply@tracknourish.xyz>",
        to: email,
        subject: "Tracknourish OTP",
        react: OtpEmailTemplate({
          firstName,
          otp,
        }),
      });
    } catch (error) {
      console.error("Error sending otp email", error);
      return ApiResponse(500, "Failed to send otp email");
    }

    const response = NextResponse.json({ message: "Otp sent successfully" }, { status: 200 })
    
    response.cookies.set("verificationToken", token,  {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 10 * 60,
      });  

    return response;
  } catch (error) {
    console.error("Error occured while sending otp", error);
    return ApiResponse(500, "Error occured while sending otp");
  }
}

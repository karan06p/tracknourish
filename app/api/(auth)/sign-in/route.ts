import { connectToDB } from "@/db/connectDb";
import { ApiResponse, comparePassword } from "@/lib/utils";
import { User } from "@/schema/UserSchema";
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { RateLimiterMemory } from "rate-limiter-flexible";

interface SignInParams{
    email: string;
    password: string;
}

dotenv.config();

const rateLimiter = new RateLimiterMemory({
  points: 4,
  duration: 80,
});

const jwtSecret = process.env.JWT_SECRET!;
const isProd = process.env.NODE_ENV === "production"

export async function POST(req: Request){

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
      try {
        await rateLimiter.consume(ip);
      } catch (rateError) {
        return ApiResponse(429, "Too many requests. Please try again later.");
      }

    connectToDB()
    try {
        const { email, password }: SignInParams = await req.json()
        if(!email || !password){
            return ApiResponse(400, "Email and password are required");
        }

        // find user in DB
        const user  = await User.findOne({ email })
        if(!user) return ApiResponse(404, "User not found");

        //check if user's email is verified
        if(!user.isEmailVerified){
            return ApiResponse(401, "Email not verified")
        }

        // check if password saved in DB is same as the password entered
        const hashedPasswordInDb = user.hashedPassword;
        const isPasswordValid = await comparePassword(password, hashedPasswordInDb)
        if(isPasswordValid === false) return ApiResponse(400, "Incorrect Password");

        // now password is valid for the given email so create jwt tokens to login the user
        const accessToken = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "15d" });

        // save the refresh token for the user in DB
        user.refreshToken = refreshToken;
        await user.save();

        const response = NextResponse.json({ message: "User signed in" }, { status: 200 });

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
        return response;
    } catch (error) {
        console.error("Error in signing in" ,error);
        return ApiResponse(400, "Error while signing in")
    }
}
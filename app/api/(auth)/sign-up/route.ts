import { connectToDB } from "@/db/connectDb";
import { ApiResponse, hashPassword } from "@/lib/utils";
import { Resend } from "resend";
import dotenv from "dotenv"
import { VerificationEmail } from "@/components/VerificationEmailTemplate";
import { User } from "@/schema/UserSchema";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

interface SignUpParams{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

dotenv.config()

const rateLimiter = new RateLimiterMemory({
  points: 2,
  duration: 60,
});

const resendApiKey = process.env.RESEND_API_KEY!;
const jwtSecret = process.env.JWT_SECRET!;

const resend = new Resend(resendApiKey);

export async function POST(req: Request) {

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
    try {
      await rateLimiter.consume(ip);
    } catch (rateError) {
      console.error("Rate Limiter Error:", rateError);
      return ApiResponse(429, "Too many requests. Please try again later.");
    }

    connectToDB();
    try {
      const { firstName, lastName, email, password }: SignUpParams = await req.json();
  
      if (!firstName || !lastName || !email || !password) {
        return ApiResponse(400, "Please provide all inputs properly");
      }
  
      const alreadyExists = await User.findOne({ email });
      if (alreadyExists) {
        return ApiResponse(300, "User already exists please sign-in");
      }
  
      const hashedPassword = await hashPassword(password);
  
      // Create the user in DB
      const newUser = new User({
        email,
        hashedPassword,
        userDetails: {
          firstName,
          lastName,
        }
      });
      await newUser.save();
      
      
      // Generate verification token(contains user email)
      const verificationToken = jwt.sign(
        { email },
        jwtSecret,
        { expiresIn: "10m" }
      );

      const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL!}/auth/verify-email?token=${verificationToken}`;
      
      // Send the verification email
      try {
        await resend.emails.send({
          from: "Tracknourish <onboarding@resend.dev>",
          to: email,
          subject: "Tracknourish Email Verification",
          react: VerificationEmail({
            firstName,
            verificationLink,
          }),
        });
      } catch (error) {
        console.error("Error sending verification email", error);
        return ApiResponse(500, "Failed to send verification email");
      };
      
      return ApiResponse(200, "Verification Email sent");
    } catch (error) {
      console.error("Error in signing up user", error);
      return ApiResponse(400, "Could not sign up");
    }
  }
  
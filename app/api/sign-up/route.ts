import { connectToDB } from "@/db/connectDb";
import { ApiResponse, hashPassword } from "@/lib/utils";
import { Resend } from "resend";
import dotenv from "dotenv"
import EmailTemplate from "@/components/Email-template";
import { User } from "@/schema/UserSchema";
import jwt from "jsonwebtoken";

interface SignUpParams{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

dotenv.config()
const resendApiKey = process.env.RESEND_API_KEY!;


const resend = new Resend(resendApiKey)

export async function POST(req: Request) {
    connectToDB();
  
    try {
      const { firstName, lastName, email, password }: SignUpParams = await req.json();
  
      if (!firstName || !lastName || !email || !password) {
        return ApiResponse(400, "Please provide all inputs properly");
      }
  
      const alreadyExists = await User.findOne({ email });
      if (alreadyExists) {
        return ApiResponse(300, "User already exists");
      }
  
      const hashedPassword = await hashPassword(password);
  
      // Create the user first so we can get the ID for the verification token
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
  
      const savedUser = await newUser.save();
  
      // Generate verification token (contains user ID)
      const verificationToken = jwt.sign(
        { userId: savedUser._id },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      );
  
      const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL!}/verify-email?token=${verificationToken}`;
  
      // Send the verification email
      try {
        const fullName = `${firstName} ${lastName}`;
        await resend.emails.send({
          from: "Meal Tracker <onboarding@resend.dev>",
          to: email,
          subject: "Meal Tracker Email Verification",
          react: await EmailTemplate({
            fullName,
            verificationLink,
          }),
        });
      } catch (error) {
        console.error("Error sending verification email", error);
        return ApiResponse(500, "Failed to send verification email");
      }
  
      // Create access and refresh tokens
      const accessToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
  
      const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
        expiresIn: "10d",
      });
  
      // Save refresh token to user record
      savedUser.refreshToken = refreshToken;
      await savedUser.save();
  
      // Create response with cookies
      const response = ApiResponse(200, "User registered");
  
      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        // secure: true, // uncomment for production
        sameSite: "strict",
        path: "/",
        maxAge: 1 * 60 * 60, // 1 hour
      });
  
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: true, // uncomment for production
        sameSite: "strict",
        path: "/",
        maxAge: 10 * 24 * 60 * 60, // 10 days
      });
  
      return response;
    } catch (error) {
      console.error("Error in signing up user", error);
      return ApiResponse(400, "Couldn't sign up");
    }
  }
  
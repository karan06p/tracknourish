import { connectToDB } from "@/db/connectDb";
import { ApiResponse } from "@/lib/utils";
import { User } from "@/schema/UserSchema";
import jwt from "jsonwebtoken"
import { Resend } from "resend";
import dotenv from "dotenv"
import EmailTemplate from "@/components/VerificationEmailTemplate";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET!;
const resendApiKey = process.env.RESEND_API_KEY!;

const resend = new Resend(resendApiKey)

export async function POST(req: Request){
    connectToDB()
    try {
        const { email } = await req.json();
        if(!email) return ApiResponse(400, "Email Parameter not found");

        const user = await User.findOne({email});
        if(!user) return ApiResponse(404, "User not found");

        if(user.isEmailVerified) return ApiResponse(409, "Email already verified");

        const firstName = user.userDetails.firstName;

        const verificationToken = jwt.sign(
                { email },
                JWT_SECRET,
                { expiresIn: "10m" }
              );
        
              const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL!}/auth/verify-email?token=${verificationToken}`;
              
              // Send the verification email
              try {
                await resend.emails.send({
                  from: "Mealivo <onboarding@resend.dev>",
                  to: email,
                  subject: "Mealivo Email Verification",
                  react: EmailTemplate({
                    firstName,
                    verificationLink,
                  }),
                });
              } catch (error) {
                console.error("Error sending verification email", error);
                return ApiResponse(500, "Failed to send verification email");
              };

        return ApiResponse(200, "Verification email sent");
    } catch (error) {
        console.error(500, "Error in resending email");
        return ApiResponse(500, "Internal error occured while resending email");
    }
}
import { connectToDB } from "@/db/connectDb";
import { ApiResponse } from "@/lib/utils";
import { User } from "@/schema/UserSchema";
import jwt from "jsonwebtoken"

interface VerifyEmailParams{
    token : string;
}

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
    connectToDB()
    try {
        const { token }: VerifyEmailParams = await req.json();
    
        if(!token) return ApiResponse(400, "Verification token is needed");
    
        const payload = jwt.verify(token, JWT_SECRET) as { email: string }
        const { email } = payload;

        if (!email) {
            return ApiResponse(400, "Invalid token payload")
          }

        // find user
        const user = await User.findOne({ email });

        if(!user){
            return ApiResponse(404, "User not found")
        }

        if(user.isEmailVerified){
            return ApiResponse(200, "Email already verified");
        }

        user.isEmailVerified = true;
        await user.save()

        
        return ApiResponse(200, "Maybe Working")    
    } catch (error) {
        console.log("Error in verifying email", error);
        return ApiResponse(400, "Error in verifying")
    }
}
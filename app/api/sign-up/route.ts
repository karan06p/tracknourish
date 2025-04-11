import { connectToDB } from "@/db/connectDb";
import { ApiResponse, hashPassword } from "@/lib/utils";
import { Resend } from "resend";
import dotenv from "dotenv"
import EmailTemplate from "@/components/Email-template";
import { User } from "@/schema/UserSchema";

interface SignUpParams{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    verificationCode: string;
}

dotenv.config()
const resendApiKey = process.env.RESEND_API_KEY!;


const resend = new Resend(resendApiKey)

export async function POST(req: Request){
    connectToDB();
    try {
        const { firstName, lastName, email, password, verificationCode}: SignUpParams = await req.json()

        if(!firstName || !lastName || !email || !password){
            return ApiResponse(400, "Please provide all inputs properly");
        }
        
        // Check if user already exists
        const alreadyExists = await User.findOne({email});
        if(alreadyExists !== null){
            return ApiResponse(300, "User already exists")
        }


        // Hash Password
        const hashedPassword = await hashPassword(password);
    
        // Send Verification Email
            try {
                const fullName = firstName + " " + lastName;
                const { data } = await resend.emails.send({
                from: "Meal Tracker <onboarding@resend.dev>",
                to: email,
                subject: "Verification Code",
                react: await EmailTemplate({
                    fullName: fullName,
                    verificationCode: verificationCode
                })
            });
                console.log(data, "Email data")
            } catch (error) {
                console.log("Error in the process of sending verification email", error)
                throw error;
            };

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            otp: verificationCode
        })
        user.save();
        
        return ApiResponse(200, "User registered") 
        } catch (error) {
        console.log("Error in signing up user", error);
        return ApiResponse(400, "Couldn't sign up")
    }
};
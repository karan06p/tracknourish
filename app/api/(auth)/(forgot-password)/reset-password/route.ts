import { connectToDB } from "@/db/connectDb";
import { ApiResponse, hashPassword } from "@/lib/utils";
import { User } from "@/schema/UserSchema";

export async function POST(req: Request){
    connectToDB();
    try {
        const { email , newPassword } = await req.json();
        if(!email || !newPassword) return ApiResponse(400, "Request Parameters not found");

        const user = await User.findOne({ email });
        if(!user) return ApiResponse(400, "User not found");

        const hashedPassword = await hashPassword(newPassword);
        
        user.hashedPassword = hashedPassword;
        user.save();

        return ApiResponse(200, "Password Resetted")
    } catch (error) {
        console.error("Internal error occured while trying to reset password", error)
        return ApiResponse(500, "Internal error occured while trying to reset password")
    }
}
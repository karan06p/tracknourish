import { connectToDB } from "@/db/connectDb";
import { ApiResponse } from "@/lib/utils";
import { User } from "@/schema/UserSchema";
import jwt from "jsonwebtoken"
import { NextRequest } from "next/server";

interface foodLoggedParams{
    foodName: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fiber: number;
    fat: number;
}

const jwtSecret = process.env.JWT_SECRET!;

export async function POST(req: NextRequest){
    connectToDB()
    try {
        const { foodName, calories, protein, carbohydrates, fiber, fat }: foodLoggedParams = await req.json()
        if(!foodName || !calories ||  !protein || !carbohydrates || !fiber || !fat) return ApiResponse(401, "All info is required");

        const accessToken = req.cookies.get("accessToken")?.value;

        if(!accessToken) return ApiResponse(401, "Access token is missing");

        let payload;
        try{
            payload = jwt.verify(accessToken, jwtSecret) as { userId: string };

        }catch{
            return ApiResponse(401, "Invalid or expired token");
        }
        
        const user = await User.findById(payload.userId);
        if(!user) return ApiResponse(400, "User not found");

        user.foodsLogged.push({
            foodName,
            calories,
            protein,
            carbohydrates,
            fiber,
            fat,
        });

        await user.save();

        return ApiResponse(200, "Food logged")

    } catch (error) {
        
    }
}
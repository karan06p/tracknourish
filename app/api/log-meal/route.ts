import { connectToDB } from "@/db/connectDb";
import { ApiResponse } from "@/lib/utils";
import { User } from "@/schema/UserSchema";
import jwt from "jsonwebtoken"
import { NextRequest } from "next/server";

interface foodLoggedParams{
    mealName: string;
    mealType: string;
    description?: string;
    calories: string;
    protein: string;
    carbohydrates: string;
    fiber: string;
    fat: string;
    tags?: string[];
}

const jwtSecret = process.env.JWT_SECRET!;

export async function POST(req: NextRequest){
    connectToDB()
    try {
        const { mealName, mealType, description, calories, protein, carbohydrates, fiber, fat, tags }: foodLoggedParams = await req.json()
        if(!mealName || !mealType || !calories ||  !protein || !carbohydrates || !fiber || !fat ) return ApiResponse(401, "All info is required");

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

        const newMeal = {
            mealName,
            mealType,
            description,
            calories,
            protein,
            carbohydrates,
            fiber,
            fat,
            tags,
        };

        user.foodsLogged.push(newMeal)

        await user.save();

        return new Response(
            JSON.stringify(newMeal),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

    } catch (error) {
        console.error("Error in logging food")
        return ApiResponse(400, "Error while trying to log food")
    }
}
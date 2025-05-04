import { connectToDB } from "@/db/connectDb";
import { ApiResponse } from "@/lib/utils";
import { User } from "@/schema/UserSchema";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface Id {
  $oid: string;
}

interface eachMeal {
  mealName: string;
  mealType: string;
  description: string;
  calories: string;
  protein: string;
  carbohydrates: string;
  fiber: string;
  fat: string;
  tags: string[];
  _id: Id;
}

const jwtSecret = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  connectToDB();
  try {
    const { mealId } = await req.json();
    if (!mealId) return ApiResponse(400, "Meal Id not received");

    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) return ApiResponse(400, "Access Token not found");
    const payload = jwt.verify(accessToken, jwtSecret) as { userId: string };

    const user = await User.findById(payload.userId).select(
      "-hashedPassword -refreshToken"
    );
    if (!user) return ApiResponse(404, "User not found");

    // Find the index of the meal to delete
    const mealIndex = user.foodsLogged.findIndex(
      (food: any) => food._id.toString() === mealId
    );

    if (mealIndex === -1) {
      return ApiResponse(400, "Meal not found in user's logged food");
    }

    // Remove the meal from the foodsLogged array
    user.foodsLogged.splice(mealIndex, 1);

    // Save the updated user document
    await user.save();

    return ApiResponse(200, "Meal Deleted");
  } catch (error) {
    console.error("Error while deleting meal", error);
    return ApiResponse(400, "Error in deleting meal");
  }
}

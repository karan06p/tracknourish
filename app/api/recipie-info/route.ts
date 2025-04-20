import { ApiResponse } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        const { foodId } = await req.json();
        if(!foodId) return ApiResponse(400, "Food Id is required");

        const data = await fetch(`https://api.spoonacular.com/recipes/${foodId}/nutritionWidget.json?apiKey=${process.env.SPOONACULAR_API}`);

        if(!data) return ApiResponse(400, "Error fetching nutrient data");

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching recipie info", error);
        return ApiResponse(400, "Error fetching recipie info")
    }
}
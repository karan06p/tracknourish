import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }){
    try {
        const { id } =  await context.params; // using await because of ESlint error only even though not needed
        if(!id) return ApiResponse(400, "Food Id is required");

        const res = await fetch(`https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${process.env.SPOONACULAR_API}`);
        if(!res) return ApiResponse(400, "Error fetching nutrient data");

        const data = await res.json()

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching recipie info", error);
        return ApiResponse(400, "Error fetching recipie info")
    }
}
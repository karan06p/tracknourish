import { ApiResponse } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const id = await req.json() 
    if (!id) {
      console.error("Food ID parameter missing");
      return ApiResponse(400, "Food ID is required");
    }

    const spoonUrl = `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${process.env.SPOONACULAR_API}`;
    const res = await fetch(spoonUrl, { method: "GET" });

    if (res.status === 402) {
      console.error("Daily API limit reached");
      return ApiResponse(
        402,
        "Daily API limit reached, please try again tomorrow"
      );
    }

    if (res.status === 429) {
      console.error("Rate limit exceeded");
      return ApiResponse(
        429,
        "Rate limit exceeded, please try again after a minute"
      );
    }

    if (!res.ok) {
      console.error(`Spoonacular API error: ${res.statusText}`);
      return ApiResponse(
        500,
        "Error fetching nutrient data from Spoonacular API"
      );
    }

    const data = await res.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in food-nutrients route", error);
    return ApiResponse(500, "Unexpected error occurred while fetching nutrient data");
  }
}

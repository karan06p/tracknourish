import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const query = req.nextUrl.searchParams.get("query");
    
        if(!query) return NextResponse.json({ message: "Query missing" }, { status: 400 });
    
        const spoonUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${process.env.SPOONACULAR_API}`;
        const res = await fetch(spoonUrl, {
            method: "GET"
        });
        const data = await res.json();
    
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching food data", error);
        return ApiResponse(400, "Error fetching food data")
    }
}
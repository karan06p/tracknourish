import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 90,
})

export async function GET(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    try {
      await rateLimiter.consume(ip)
    } catch (error) {
      return ApiResponse(429, "Too many requests. Please try again later.")
    }
  try {
    const query = req.nextUrl.searchParams.get("query");

    if (!query) {
      console.error("Query parameter missing");
      return ApiResponse(400, "Query parameter is required");
    }

    const spoonUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${process.env.SPOONACULAR_API!}`;
    const res = await fetch(spoonUrl, {
      method: "GET",
    });
    if (res.status === 402) {
      console.error("Daily API limit reached");
      return ApiResponse(402, "Daily API limit reached, please try again tomorrow");
    }

    if (res.status === 429) {
      console.error("Rate limit exceeded");
      return ApiResponse(429, "Rate limit exceeded, please try again after a minute");
    }

    if (!res.ok) {
      console.error(`Spoonacular API error: ${res.statusText}`);
      return ApiResponse(500, "Error fetching meal data from Spoonacular API");
    }
    const data = await res.json();

    return NextResponse.json(data, {status: 200});
  } catch (error) {
    console.error("Unexpected error in search-meal route", error);
    return ApiResponse(500, "Unexpected error occurred while fetching meal data");
  }
}

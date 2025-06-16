import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/schema/UserSchema";
import { connectToDB } from "@/db/connectDb";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"
import { RateLimiterMemory } from "rate-limiter-flexible";

dotenv.config()
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const rateLimiter = new RateLimiterMemory({
  points: 4,
  duration: 60,
});

const jwtSecret = process.env.JWT_SECRET!;

export async function POST(req: NextRequest, res: NextResponse) {

  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  try {
    await rateLimiter.consume(ip);
  } catch (rateError) {
    return ApiResponse(429, "Too many requests. Please try again later.");
  }


  connectToDB();
  try {
    const { type } = await req.json();
    if (!type) return ApiResponse(400, "Type of image not received");
    if (type !== "cover" && type !== "profile") {
      return ApiResponse(400, "File type is incorrect");
    }
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return ApiResponse(400, "Access Token not found");
    }
    let payload;
    try {
      payload = jwt.verify(accessToken, jwtSecret) as { userId: string };
    } catch {
      return ApiResponse(401, "Invalid or expired token");
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return ApiResponse(400, "User not found");
    }
    let publicId;
    if (type === "profile") {
      publicId = user.userDetails.profilePicId;
    } else {
      publicId = user.userDetails.coverBgId;
    }
    if (!publicId) {
      return ApiResponse(400, "Image's public id not found");
    }

    try {
      const res = await cloudinary.uploader.destroy(publicId);
      if (res.result !== "ok") {
        return ApiResponse(500, "Image deletion in cloudinary failed");
      }
    } catch (error) {
      console.error("Error occured in deleting image from cloudinary", error);
      return ApiResponse(
        500,
        "Error occured in deleting image from cloudinary"
      );
    }

    if (type === "cover") {
      user.userDetails.coverBgUrl = null;
      user.userDetails.coverBgId = null;
    } else {
      user.userDetails.profilePicUrl = null;
      user.userDetails.profilePicId = null;
    }
    user.save();

    return ApiResponse(200, "Image deleted successfully");
  } catch (error) {
    console.error("Error in deleting image", error);
    return ApiResponse(500, "Error in deleting image");
  }
}

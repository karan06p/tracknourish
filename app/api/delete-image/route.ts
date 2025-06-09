import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/schema/UserSchema";
import { connectToDB } from "@/db/connectDb";
import { v2 as cloudinary } from "cloudinary";

const jwtSecret = process.env.JWT_SECRET!;

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest, res: NextResponse) {
  connectToDB();
  try {
    const { type } = await req.json();
    if (!type) return ApiResponse(400, "Type of image not received");
    if (type !== "cover" && type !== "profile") {
      console.log("FIle type is incorrect");
      return ApiResponse(400, "File type is incorrect");
    }
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      console.log("Access Token not found");
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
      console.log("User not found");
      return ApiResponse(400, "User not found");
    }
    let publicId;
    if (type === "profile") {
      publicId = user.userDetails.profilePicId;
    } else {
      publicId = user.userDetails.coverBgId;
    }
    if (!publicId) {
      console.log("Public id not found");
      return ApiResponse(400, "Image's public id not found");
    }

    try {
      const res = await cloudinary.uploader.destroy(publicId);
      if (res.result !== "ok") {
        console.log("Cloudinary deletion failed");
        return ApiResponse(500, "Image deletion in cloudinary failed");
      }
      // thought: WE CAN RETRY THE DELETION HERE AND IF STILL IT FAILS THEN RETURN
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

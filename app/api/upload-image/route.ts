import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { ApiResponse } from "@/lib/utils";
import { connectToDB } from "@/db/connectDb";
import jwt from "jsonwebtoken";
import { User } from "@/schema/UserSchema";
import dotenv from "dotenv";
import { RateLimiterMemory } from "rate-limiter-flexible"

interface CloudinaryUploadResults {
  public_id: string;
  format: string;
  width: number;
  height: number;
  secure_url: string;
  created_at: string;
  original_filename: string;
  signature: string;
}

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
dotenv.config()

const rateLimiter = new RateLimiterMemory({
  points: 3,
  duration: 60,
})

const jwtSecret = process.env.JWT_SECRET!;

const handleDeleteImage = async (publicId: string) => {
   try {
      const res = await cloudinary.uploader.destroy(publicId);
      if (res.result !== "ok"){
        return ApiResponse(400, "Image deletion in cloudinary failed");
}
    } catch (error) {
      console.error("Error occured in deleting image from cloudinary", error);
      return ApiResponse(
        500,
        "Error occured in deleting image from cloudinary"
      );
    }
}

export async function POST(req: NextRequest) {

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    await rateLimiter.consume(ip)
  } catch (error) {
    return ApiResponse(429, "Too many requests. Please try again later.");
  }

  connectToDB();
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | undefined;
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!file) return ApiResponse(400, "File not found");
    if(type !== "cover" && type !== "profile") return ApiResponse(400, "File type is incorrect");
    if (!accessToken) return ApiResponse(500, "Access Token not found");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let payload;
    try {
      payload = jwt.verify(accessToken, jwtSecret) as { userId: string };
    } catch {
      return ApiResponse(401, "Invalid or expired token");
    }    
    const user = await User.findById(payload.userId);
    if (!user) return ApiResponse(400, "User not found");

    //Check before uploading if there is already a image uploaded for the given type
    let publicId;
    if(type === "profile" && user.userDetails.profilePicUrl !== null){
        publicId = user.userDetails.profilePicId;
        await handleDeleteImage(publicId);
        user.userDetails.profilePicUrl = null;
        user.userDetails.profilePicId = null;
    };
    if(type === "cover" && user.userDetails.coverBgUrl !== null){
        publicId = user.userDetails.coverBgId;
        await handleDeleteImage(publicId);
        user.userDetails.coverBgUrl = null;
        user.userDetails.coverBgId = null;
    };

    const result = await new Promise<CloudinaryUploadResults>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: type },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResults);
          }
        );
        uploadStream.end(buffer);
      }
    );

    if(type === "profile"){   
      user.userDetails.profilePicUrl = result.secure_url;
      user.userDetails.profilePicId = result.public_id;
    }else{
      user.userDetails.coverBgUrl = result.secure_url;
      user.userDetails.coverBgId = result.public_id;
    }
    await user.save()
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}

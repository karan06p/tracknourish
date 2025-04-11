import { clsx, type ClassValue } from "clsx"
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ApiResponse(statusCode: number, message: string) {
  return NextResponse.json({ message }, { status: statusCode });
}

export async function hashPassword(password: string){
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string){
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
}
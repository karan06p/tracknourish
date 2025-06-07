import { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Authentication",
    description: "Sign Up to Mealivo",
};


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="h-screen w-screen"
        >
          {children}
        </div>
    );
  }
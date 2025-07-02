"use client"
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";    
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
    
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return ( 
        <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
          xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center p-2"
>
  <path
    d="M12 3a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 0 1 0-1.414l7-7A1 1 0 0 1 12 3z"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M8 14l4-4 4 4"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
          <span className="text-xl font-display font-medium">Tracknourish</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/auth/sign-in"
            >
          <Button className="hidden sm:flex glass-button text-sm px-5 py-2 rounded-full cursor-pointer">
                Sign In
          </Button>
          </Link>
            <Link href={"/auth/sign-in"}>
            <button className="sm:hidden text-gray-700">
            <CircleUser />
            </button>
            </Link>
        </div>
      </div>
    </header>
    );
}
 
export default Navbar;
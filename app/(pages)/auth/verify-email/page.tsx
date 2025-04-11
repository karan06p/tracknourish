"use client"
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = () => {
    setIsResending(true);
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      toast.success("Verification email resent successfully!", {
        description: "Please check your inbox",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-display font-bold text-gray-900">Verify your email</h1>
          
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 border border-gray-100">
            <p className="text-gray-600">
              We've sent a verification link to your email. Please click the link to activate your account.
            </p>
            
            <div className="py-4 flex justify-center">
              <div className="inline-flex items-center justify-center space-x-2">
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-500">Didn't receive the email?</p>
              <Button 
                onClick={handleResendEmail} 
                disabled={isResending}
                className="mt-2 w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend Email"
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Link href="/signin" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
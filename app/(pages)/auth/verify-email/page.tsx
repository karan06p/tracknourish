"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const VerifyEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  useEffect(() => {
    const channel = new BroadcastChannel("email-verification");
    
    channel.onmessage = (event) => {
      if (event.data === "verified") {
        // Close self only if it's the original static tab
        if (localStorage.getItem("canSelfClose") === "true") {
          localStorage.removeItem("canSelfClose");
          window.close();
        }
      }
    };

    const verifyUserEmail = async () => {
      if(!token) return;
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({token}),
        })

        const data = await res.json();
        console.log("Verification data: ", data);
        console.log(res)
        if(res.status === 200){
          setIsVerified(true);
          channel.postMessage("verified");
          router.push("/dashboard")
          // TODO:- Add a loader here to make user experience smoother
        }
      } catch (error) {
        console.error("Failed to verify email", error)
        toast.warning("An error occurred while verifying your email.")
      }

    };

    verifyUserEmail();

    return () => channel.close();
  }, []);

  useEffect(() => {

  }, [token])

  //TODO :- Complete
  const handleResendEmail = async () => {
    setIsResending(true)
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/resend-email`, {
      method: "POST",
      body: JSON.stringify({
        token
      }),
    })
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
          <h1 className="text-3xl font-display font-bold text-gray-900">
            {isVerified ? "Email Verified!" : "Verify your email"}
          </h1>
          
          <div className={cn(
            "bg-white rounded-xl shadow-sm p-6 space-y-4 border border-gray-100",
            "transition-all duration-500",
            isVerified && "border-green-200 bg-green-50/50"
          )}>
            {isVerified ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-center">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-700">
                  Your email has been successfully verified! Your account is now active.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-600">
                  We've sent a verification link to your email. Please click the link to activate your account.
                </p>
                
                <div className="py-4 flex justify-center">
                  <button className="focus:outline-none" aria-label="Check verification status">
                    <div className="inline-flex items-center justify-center space-x-2">
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                    </div>
                  </button>
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
              </>
            )}
          </div>
          
          <div className="mt-4">
            <Link href="/auth/sign-in" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
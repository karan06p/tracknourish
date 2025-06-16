"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const VerifyEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL!}/api/verify-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        if (res.status === 200) {
          setIsVerified(true);
          localStorage.removeItem("userEmail");

          const countdownInterval = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
          }, 1000);

          const redirectTimeout = setTimeout(() => {
            router.push("/");
          }, 4000);

          return () => {
            clearInterval(countdownInterval);
            clearTimeout(redirectTimeout);
          };
        }
      } catch (error) {
        console.error("Failed to verify email", error);
        toast.warning("An error occurred while verifying your email.");
      }
    };

    verifyUserEmail();
  }, [router, token]);

  return (
     <Suspense fallback={<div>Loading...</div>}>
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

          <div
            className={cn(
              "bg-white rounded-xl shadow-sm p-6 space-y-4 border border-gray-100 transition-all duration-500",
              isVerified && "border-green-200 bg-green-50/50"
            )}
          >
            {isVerified ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-center">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-700">
                  Your email has been successfully verified! Your account is now
                  active.
                </p>
                <p className="text-sm text-gray-500">
                  You will be redirected in{" "}
                  <span className="text-purple-600 font-semibold">
                    {secondsLeft}
                  </span>{" "}
                  second{secondsLeft !== 1 && "s"}...
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-600">
                  We&#39;ve sent a verification link to your email. Please click the
                  link in your email to activate your account.
                </p>

                <div className="py-4 flex justify-center">
                  <button
                    className="focus:outline-none"
                    aria-label="Checking verification status"
                  >
                    <div className="inline-flex items-center justify-center space-x-2">
                      <div
                        className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "600ms" }}
                      ></div>
                    </div>
                  </button>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-500">
                    Didn&#39;t receive the email?
                  </p>
                  <Button className="mt-2 w-full cursor-pointer">
                    <Link href="/auth/resend-email">Resend Email</Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Once verified, you may safely close this tab.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </Suspense>
  );
};

export default VerifyEmail;

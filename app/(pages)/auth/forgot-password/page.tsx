"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Oval } from "react-loader-spinner";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// Schema for Email Form
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Schema for New Password Form
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false);
  const [resendOtpTimer, setResendOtpTimer] = useState(0);

  // Email Form
  const emailForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // New Password Form
  const passwordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

   useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendOtpTimer > 0) {
      interval = setInterval(() => {
        setResendOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendOtpTimer]);

  const handleEmailSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      setCurrentEmail(values.email);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message || "OTP has been sent to your email.");
        setOtpSent(true);
        setResendOtpTimer(120);
      } else if (res.status === 401) {
        toast.error(data?.message || "Email not verified", {
          description: (
            <Link href={"/auth/resend-email"}>
            <Button
              className="absolute bottom-2 right-2 hover:cursor-pointer"
              variant="ghost"
            >
              Verify
            </Button>
              </Link>
          ),
        });
        setIsLoading(false);
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message || "OTP verified successfully.");
        setOtpVerified(true);
      } else {
        toast.error(data.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResendingOtp(true);
      if (!currentEmail) {
        toast.error("No email provided");
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentEmail }),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        toast.success("OTP has been resent to your email.");
        setResendOtpTimer(120);
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handlePasswordSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: currentEmail,
            newPassword: values.password,
          }),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message || "Password reset successfully.");
        router.push("/auth/sign-in");
      } else {
        toast.error(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Forgot Password
        </h1>
        {!otpSent && !otpVerified ? (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
              className="space-y-6"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full cursor-pointer">
                {isLoading ? (
                  <>
                    Sending
                    <Oval
                      visible={isLoading}
                      height="24"
                      width="24"
                      strokeWidth="5"
                      color="#FFFFFF"
                      secondaryColor="#FFFFFF"
                      ariaLabel="oval-loading"
                    />
                  </>
                ) : (
                  <p>Send OTP</p>
                )}
              </Button>
            </form>
          </Form>
        ) : !otpVerified ? (
          <div className="space-y-6">
            <p className="text-center text-gray-600">
              Enter the OTP sent to your email.
            </p>
            <div className="w-full flex items-center justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button onClick={handleOtpSubmit} className="w-full cursor-pointer">
              {isLoading ? (
                <>
                  Verifying
                  <Oval
                    visible={isLoading}
                    height="24"
                    width="24"
                    strokeWidth="5"
                    color="#FFFFFF"
                    secondaryColor="#FFFFFF"
                    ariaLabel="oval-loading"
                  />
                </>
              ) : (
                <p>Verify OTP</p>
              )}
            </Button>
            <div className="text-center">
              <p className="text-sm text-gray-600">Didn&#39;t receive the OTP?</p>
              <Button
                onClick={handleResendOtp}
                variant="link"
                className="text-blue-600 hover:text-blue-800"
                disabled={isLoading || resendOtpTimer > 0}
              >
                {isResendingOtp ? (
                  <Oval
                    visible={isResendingOtp}
                    height="24"
                    width="24"
                    strokeWidth="5"
                    color="#155dfc"
                    secondaryColor="#155dfc"
                    ariaLabel="oval-loading"
                  />
                ) : (
                  <>
                    {resendOtpTimer > 0 ? `Resend OTP (${resendOtpTimer}s)` : "Resend OTP"}
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className="space-y-6"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Enter new password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          {...field}
                          autoComplete="off"
                        />
                        <Button
                          type="button"
                          variant="link"
                          size="icon"
                          className="absolute right-1 top-0 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4 text-gray-400" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full cursor-pointer">
                {isLoading ? (
                  <>
                    Resetting
                    <Oval
                      visible={isLoading}
                      height="24"
                      width="24"
                      strokeWidth="5"
                      color="#FFFFFF"
                      secondaryColor="#FFFFFF"
                      ariaLabel="oval-loading"
                    />
                  </>
                ) : (
                  <p>Reset Password</p>
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

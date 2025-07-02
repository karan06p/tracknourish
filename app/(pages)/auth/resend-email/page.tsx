"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";

const resendEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type resendEmailValues = z.infer<typeof resendEmailSchema>;

export default function ResendEmailPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<resendEmailValues>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: resendEmailValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL!}/api/resend-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message || "Verification email sent.");
        router.push("/auth/verify-email");
      } else if (res.status === 404) {
        toast.error("User already exists", {
          action: (
            <div className="grid">
              <Link href="/auth/sign-in">
              <Button
                variant="link"
                className="p-0 text-white hover:text-gray-100 hover:cursor-pointer "
              >
                Sign in
              </Button>
                </Link>
            </div>
          ),
        });
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="flex flex-col items-center">
          <Mail className="h-20 w-20 text-blue-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">
            Resend Verification Email
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Enter your email address below and we&#39;ll send you a new verification
            link.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full mt-4 hover:cursor-pointer">
              {isLoading ? "Sending..." : "Resend Email"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

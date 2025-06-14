"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Oval } from "react-loader-spinner";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setIsLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
      credentials: "include",
    });
    const data = await res.json();
    if (res.status === 200) {
      toast.success("Signed in successfully!", {
        description: "Redirecting to dashboard...",
      });
      router.push("/");
      setIsLoading(false);
    } else if (res.status === 401) {
      toast.error(data?.message || "Email not verified", {
        description: (
          <Button
            className="absolute bottom-2 right-2 hover:cursor-pointer"
            variant="ghost"
          >
            <Link href={"/auth/resend-email"}>Verify</Link>
          </Button>
        ),
      });
      setIsLoading(false);
    } else {
      toast.error(data?.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          placeholder="••••••••"
                          {...field}
                          autoComplete="off"
                        />
                        <Button
                          type="button"
                          variant="link"
                          size="icon"
                          className="absolute right-1 top-0 cursor-pointer"
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
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
              <div className="flex items-center justify-end">
                <Link
                  href={"/auth/forgot-password"}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>

              {isLoading ? (
                <Button
                  className="w-full hover:cursor-none"
                  disabled={isLoading}
                >
                  Signing In
                  <Oval
                    visible={isLoading}
                    height="80"
                    width="80"
                    color="#FFFFFF"
                    secondaryColor="#FFFFFF"
                    ariaLabel="oval-loading"
                  />{" "}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full hover:cursor-pointer"
                  disabled={isLoading}
                >
                  Sign In <LogIn className="ml-2 h-4 w-4 cursor-pointer" />
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-blue-600 hover:text-blue-800 font-medium hover:cursor-pointer"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;

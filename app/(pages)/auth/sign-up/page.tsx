"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Oval } from "react-loader-spinner";

const signUpFormSchema = z.object({
  firstName: z.string().min(2).max(15),
  lastName: z.string().min(2).max(15),
  email: z.string().email(),
  password: z
    .string()
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
});

export default function SignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onFormSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    setIsLoading(true);
    const { firstName, lastName, email, password } = values;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    })
      .then((response) => {
        response.json().then((data) => {
          if (response.status === 200) {
            toast.success(data.message);
            router.push("/auth/verify-email");
          } else {
            toast.error(data.message);
          }
        });
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pw: string) => pw?.length >= 8 },
    {
      label: "At least one uppercase letter",
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: "At least one lowercase letter",
      test: (pw: string) => /[a-z]/.test(pw),
    },
    { label: "At least one number", test: (pw: string) => /[0-9]/.test(pw) },
    {
      label: "At least one special character",
      test: (pw: string) => /[#?!@$%^&*-]/.test(pw),
    },
  ];

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onFormSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="John"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Doe"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          autoComplete="off"
                          placeholder="••••••••"
                          onFocus={() => setOpenPopover(true)}
                          onBlur={() => setOpenPopover(false)}
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
                        {/* Render dropdown with password conditions */}
                        {openPopover && (
                          <div className="absolute top-full mt-1 w-80 bg-white border rounded shadow-lg p-2 z-20">
                            <div className="space-y-2">
                              {passwordRequirements.map((rule, index) => {
                                const isValid = rule.test(field.value);
                                return (
                                  <div
                                    key={index}
                                    className={cn(
                                      "flex items-center space-x-2",
                                      isValid
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    )}
                                  >
                                    <span className="text-lg">
                                      {isValid ? (
                                        <CheckCircle className="w-4 h-4" />
                                      ) : (
                                        <XCircle className="w-4 h-4 text-red-600" />
                                      )}
                                    </span>
                                    <span className="text-sm">
                                      {rule.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoading ? (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Signing Up
                  <Oval
                    visible={isLoading}
                    height="80"
                    width="80"
                    color="#FFFFFF"
                    secondaryColor="#FFFFFF"
                    ariaLabel="oval-loading"
                  />
                </Button>
              ) : (
                <Button type="submit" className="w-full cursor-pointer">
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

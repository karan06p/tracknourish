import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication",
    description: "Sign Up to Meal tracker",
};


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="h-screen w-screen flex items-center justify-center"
        >
          {children}
        </div>
    );
  }
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication",
    description: "Sign Up to Tracknourish",
};


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="h-screen w-screen bg-gray-50"
        >
          {children}
        </div>
    );
  }
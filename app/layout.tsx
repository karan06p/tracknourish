import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tracknourish - Track Your Nutrition",
  description: "Easily track your daily meals and nutrition and get a described view into your food.",
   openGraph: {
    title: "Tracknourish",
    description: "Track your meals and nutrition easily.",
    url: "https://tracknourish.xyz",
    siteName: "Tracknourish",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon:"favicon.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors/>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

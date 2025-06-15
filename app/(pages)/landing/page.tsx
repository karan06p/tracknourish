"use client";

import React, { useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import Navbar from "@/components/Navbar";
import FAQ from "@/sections/FaqSection";
import PricingSection from "@/sections/PricingSection";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !imageRef.current) return;

      // Parallax effect for the image
      const scrollPosition = window.scrollY;
      const translateY = scrollPosition * 0.2;

      imageRef.current.style.transform = `translateY(${translateY}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Intuitive Tracknourish",
      description:
        "Quickly log your meals with our user-friendly interface. Take photos, scan barcodes, or use voice input for effortless tracking.",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Detailed Nutritional Insights",
      description:
        "Gain comprehensive insights into your nutritional intake. Track macros, vitamins, and minerals with detailed visualizations.",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            d="M4.93 19.07A10 10 0 1 1 19.07 4.93 10 10 0 0 1 4.93 19.07zm0 0L2 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 10.5h10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 7v7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Personal Goal Setting",
      description:
        "Set custom nutrition goals based on your dietary preferences and fitness objectives. Track your progress with visual indicators.",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "AI-Powered Recommendations",
      description:
        "Receive personalized meal suggestions and nutritional advice based on your eating habits and health goals.",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zM21 11v8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zM14 11v8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 11V7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Recipe Database",
      description:
        "Access thousands of healthy recipes with detailed nutritional information. Filter by dietary restrictions and preferences.",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            d="M8 18h8M10 7.236a3 3 0 0 1 4 0M7 3v2M17 3v2M6.2 21h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 19.48 21 18.92 21 17.8V8.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 5 18.92 5 17.8 5H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 6.52 3 7.08 3 8.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 21 5.08 21 6.2 21z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Meal Planning",
      description:
        "Plan your weekly meals in advance with smart suggestions based on your nutritional goals and preferences.",
    },
  ];

  return (
    <>
    <Navbar />
    <div
      ref={heroRef}
      className="relative min-h-screen pt-24 px-6 md:px-10 overflow-hidden bg-white"
    >
      <div
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-20 pt-16 md:pt-24">
        <div className="w-full lg:w-1/2 animate-fade-in-up">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 animate-scale-in">
              Simplify Your Nutrition Journey
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Track Your Meals with Elegant Simplicity
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Tracknourish helps you maintain a healthy lifestyle through
              intuitive meal tracking, detailed nutritional insights, and
              personalized recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="/auth/sign-up"
                className="glass-button px-8 py-3 rounded-full text-center font-medium"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="px-8 py-3 rounded-full bg-white border border-gray-300 text-gray-700 text-center font-medium transition-colors hover:bg-gray-50"
              >
                Learn More
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  loading="lazy"
                />
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">5.000+</span>{" "}
                active users
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-full animate-fade-in-up animation-delay-150">
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-100/30 rounded-3xl transform rotate-3 scale-105 animate-blur-in"
              aria-hidden="true"
            />
            <div className="glass-card absolute inset-4 rounded-2xl overflow-hidden shadow-lg animate-scale-in">
              <img
                ref={imageRef}
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80"
                alt="Healthy meals"
                className="w-full h-full object-cover transform scale-105"
                loading="lazy"
              />
            </div>

            <div className="absolute top-6 -left-8 glass-card p-4 rounded-xl shadow-md animate-fade-in animation-delay-200 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                      stroke="#22C55E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="#22C55E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium">Daily Goal</p>
                  <p className="text-sm font-semibold">87% Complete</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-2 -right-8 glass-card p-4 rounded-xl shadow-md animate-fade-in animation-delay-300 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 6v6l4 2"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium">Tracked meals</p>
                  <p className="text-sm font-semibold">1,248 this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </div>


    {/* Features Section */}

    <section id="features" className="py-24 px-6 md:px-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in-up">
          <span className="inline-block py-1 px-3 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Everything you need to maintain a healthy diet
          </h2>
          <p className="text-lg text-gray-600">
            Our comprehensive set of features helps you track, analyze, and improve your nutrition habits with minimal effort and maximum results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
    <PricingSection />
    <FAQ />
    <Footer />
    </>
  );
}

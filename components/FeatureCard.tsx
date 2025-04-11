import React from "react";
import { cn } from "@/lib/utils";

export const FeatureCard = ({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md animate-fade-in-up",
        {
          "animation-delay-100": index % 3 === 0,
          "animation-delay-200": index % 3 === 1,
          "animation-delay-300": index % 3 === 2,
        }
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};


import React from 'react';
import PricingCard from '../components/PricingCard';
import { Check, Star } from 'lucide-react';

const PricingSection = () => {
  const basicFeatures = [
    "Log Basic meals",
    "Basic nutritional insights",
    "Access to meal search"
  ];

  const proFeatures = [
    "Log unlimited meals",
    "Advanced nutritional insights",
    "Personalized meal recommendations",
    "Priority support",
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you are ready. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            title="Basic"
            subtitle="Perfect for getting started"
            price="Free"
            period=""
            features={basicFeatures}
            buttonText="Get Started"
            buttonLink="/auth/sign-up"
            buttonVariant="outline"
            icon={<Check className="w-6 h-6" />}
            popular={false}
          />
          
          <PricingCard
            title="Pro"
            subtitle="Perfect for people focused towards their diet"
            price="Coming Soon"
            period=""
            features={proFeatures}
            buttonText="Notify Me"
            buttonLink=""
            buttonVariant="default"
            icon={<Star className="w-6 h-6" />}
            popular={false}
            comingSoon={true}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
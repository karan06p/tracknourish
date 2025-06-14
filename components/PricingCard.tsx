import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonLink: string
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  icon: React.ReactNode;
  popular?: boolean;
  comingSoon?: boolean;
}

const PricingCard = (props: PricingCardProps) => {
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      props.popular ? 'border-primary shadow-lg scale-105' : 'hover:border-primary/50'
    }`}>
      {props.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-center py-2 text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <CardHeader className={`text-center pb-4 ${props.popular ? 'pt-12' : 'pt-6'}`}>
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${
            props.popular ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {props.icon}
          </div>
        </div>
        
        <CardTitle className="text-2xl font-bold">{props.title}</CardTitle>
        <CardDescription className="text-muted-foreground">{props.subtitle}</CardDescription>
        
        <div className="pt-4">
          <div className="flex items-baseline justify-center">
            <span className={`text-4xl font-bold ${props.comingSoon ? 'text-muted-foreground' : ''}`}>
              {props.price}
            </span>
            {props.period && (
              <span className="text-muted-foreground ml-1">/{props.period}</span>
            )}
          </div>
          {props.comingSoon && (
            <Badge variant="secondary" className="mt-2">
              Coming Soon
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <ul className="space-y-3">
          {props.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className={`w-4 h-4 flex-shrink-0 ${
                props.comingSoon ? 'text-muted-foreground' : 'text-primary'
              }`} />
              <span className={`text-sm ${
                props.comingSoon ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-6 pb-6 px-6">
        <Link href={props?.buttonLink || ""}>
        <Button 
          className="w-ful cursor-pointer" 
          variant={props.buttonVariant}
          disabled={props.comingSoon}
        >
          {props.buttonText}
        </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
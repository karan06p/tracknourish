"use client"

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Edit, 
  User, 
  Calendar,
  Apple,
  Salad,
  Trophy,
  Flame,
  Timer,
  Scale,
  LineChart
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

const Profile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, firstLetter, isError } = useUser();
  const router = useRouter()
  
  if (isLoading) return <p>Loading...</p>;
  if (isError || !user) {
    toast("User not found");
    return <p>Error loading user info</p>;
  };

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await fetch(`${baseUrl}/api/sign-out`).then((res) => {
        if(res.status === 200){
          router.refresh()
          toast.success("Signed Out")
        }
      })
    } catch (error) {
      console.error("Sign out failed", error);
      toast.error("Sign Out failed :(")
    } finally{
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header with profile banner */}
      <div className="relative h-48 w-full bg-gradient-to-r from-green-50 to-teal-100">
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute right-4 top-4 bg-white/70 backdrop-blur-sm hover:bg-white/90"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content container */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 flex flex-col gap-6">
          {/* Profile header with avatar */}
          <div className="flex flex-col items-center sm:flex-row sm:gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                {/* <AvatarImage src="/placeholder.svg" alt="User profile" /> */}
                <AvatarFallback className="text-2xl">{firstLetter}</AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 flex-1 text-center sm:mt-0 sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-foreground">{`${user.firstName} ${user.lastName}`}</h1>
                <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                  <Edit className="mr-2 h-3.5 w-3.5" />
                  Edit Profile
                </Button>
              </div>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
                <div className="flex items-center">
                  <User className="mr-1 h-3.5 w-3.5" />
                  Young
                </div>
                <div className="flex items-center">
                  <Scale className="mr-1 h-3.5 w-3.5" />
                  60kg
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  Member since Jan 2025
                </div>
              </div>
            </div>
          </div>
          
          {/* Daily Nutritional Goals Progress */}
          <Card>
            <CardHeader className="pb-3">
              <h2 className="text-lg font-medium">Today's Nutrition Goals</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm text-muted-foreground">1,200 / 2,000 kcal</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Protein</span>
                      <span className="text-sm text-muted-foreground">45 / 75g</span>
                    </div>
                    <Progress value={60} className="h-2 bg-blue-100" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Carbs</span>
                      <span className="text-sm text-muted-foreground">120 / 250g</span>
                    </div>
                    <Progress value={48} className="h-2 bg-amber-100"/>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Fat</span>
                      <span className="text-sm text-muted-foreground">30 / 55g</span>
                    </div>
                    <Progress value={54} className="h-2 bg-green-100"/>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile content cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent meals card */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium flex items-center">
                    <Salad className="h-5 w-5 mr-2" />
                    Recent Meals
                  </h2>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Breakfast */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <Apple className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">Breakfast</p>
                      <p className="text-xs text-muted-foreground">Oatmeal with berries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">320 kcal</p>
                    <p className="text-xs text-muted-foreground">8:30 AM</p>
                  </div>
                </div>
                
                {/* Lunch */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <Salad className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">Lunch</p>
                      <p className="text-xs text-muted-foreground">Chicken salad with avocado</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">450 kcal</p>
                    <p className="text-xs text-muted-foreground">12:45 PM</p>
                  </div>
                </div>
                
                {/* Snack */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <Apple className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">Snack</p>
                      <p className="text-xs text-muted-foreground">Greek yogurt with nuts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">180 kcal</p>
                    <p className="text-xs text-muted-foreground">3:30 PM</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-2">
                  Add Meal
                </Button>
              </CardContent>
            </Card>
            
            {/* Stats card */}
            <Card>
              <CardHeader className="pb-3">
                <h2 className="text-lg font-medium flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Progress Stats
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-3">
                    <div className="flex items-center text-primary mb-1">
                      <Flame className="h-4 w-4 mr-1" />
                    </div>
                    <span className="text-2xl font-medium text-primary">1,245</span>
                    <span className="text-xs text-muted-foreground">Avg. Daily Calories</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-3">
                    <div className="flex items-center text-primary mb-1">
                      <Salad className="h-4 w-4 mr-1" />
                    </div>
                    <span className="text-2xl font-medium text-primary">82</span>
                    <span className="text-xs text-muted-foreground">Meals Tracked</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-3">
                    <div className="flex items-center text-primary mb-1">
                      <Timer className="h-4 w-4 mr-1" />
                    </div>
                    <span className="text-2xl font-medium text-primary">21</span>
                    <span className="text-xs text-muted-foreground">Days Streak</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-3">
                    <div className="flex items-center text-primary mb-1">
                      <LineChart className="h-4 w-4 mr-1" />
                    </div>
                    <span className="text-2xl font-medium text-primary">-3.5</span>
                    <span className="text-xs text-muted-foreground">lbs This Month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Personal nutrition preferences */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Nutrition Preferences</h2>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dietPlan">Diet Plan</Label>
                    <Input id="dietPlan" value="Balanced" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dailyCalories">Daily Calorie Goal</Label>
                    <Input id="dailyCalories" value="2,000 kcal" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies & Intolerances</Label>
                    <Input id="allergies" value="Lactose, Peanuts" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Primary Goal</Label>
                    <Input id="goal" value="Weight Loss" readOnly />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein Split</Label>
                    <Input id="protein" value="30%" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbs Split</Label>
                    <Input id="carbs" value="45%" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fats">Fats Split</Label>
                    <Input id="fats" value="25%" readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
            <div className="w-full text-center">
              <Button className="w-26 hover:cursor-pointer" variant={"destructive"} onClick={handleSignOut}>Sign Out</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
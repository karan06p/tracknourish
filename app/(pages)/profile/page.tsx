"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Apple,
  Salad,
  Trophy,
  Flame,
  Timer,
  LineChart,
  LogOut,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { eachMeal } from "@/types/Meal";
import ImageUploader from "@/components/ImageUploader";
import DailyNutritionalProgress from "@/components/DailyNutritionalProgress";
import NutritionalPreferences from "@/components/NutritionalPreferences";
import { Oval } from "react-loader-spinner";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

const Profile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [avgCalories, setAvgCalories] = useState<number | undefined>();
  const [profilePicUrl, setProfilePicUrl] = useState<string | undefined>();
  const [coverPicUrl, setCoverPicUrl] = useState<string | undefined>();
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<string | undefined>();
  const { user, firstLetter, isLoading, isError } = useUser();
  const router = useRouter();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const createdAt: string = user?.createdAt;
    const joinedDate = new Date(createdAt);
    const month = joinedDate.getMonth();
    const year = joinedDate.getFullYear();
    if (joinedDate) {
      setMonth(months[month]);
      setYear(year.toString());
    }
    if (user?.userDetails?.foodsLogged) {
      let totalCalories = 0;
      let totalProtein = 0;
      let totalFiber = 0;
      user.userDetails?.foodsLogged.forEach((item: eachMeal) => {
        const calories = parseFloat(item.calories);
        const protein = parseFloat(item.protein);
        const fiber = parseFloat(item.fiber);
        if (!isNaN(calories)) {
          totalCalories += calories;
        }
        if (!isNaN(protein)) {
          totalProtein += protein;
        }
        if (!isNaN(fiber)) {
          totalFiber += fiber;
        }
      });
      if (user?.userDetails?.foodsLogged.length > 0) {
        let calculatedAvgCalories = (
          totalCalories / user.userDetails?.foodsLogged.length
        ).toFixed(1);
        setAvgCalories(Number(calculatedAvgCalories));
      } else {
        setAvgCalories(0);
      }
      if (user?.userDetails?.profilePicUrl) {
        setProfilePicUrl(user.userDetails.profilePicUrl);
      }
      if (user?.userDetails?.coverBgUrl) {
        setCoverPicUrl(user.userDetails.coverBgUrl);
      }
    }
  }, [user]);

  if (isLoading){;
  <div className="w-screen h-screen flex items-center justify-center">
    <Oval
      visible={isLoading}
      height="80"
      width="80"
      strokeWidth="5"
      color="#155dfc"
      secondaryColor="#155dfc"
      ariaLabel="oval-loading"
    />
  </div>;
  }
  if (isError) {
    toast("User not found");
    return <p>Error loading user info</p>;
  }

  const recentMeals: [eachMeal] = user?.userDetails?.foodsLogged
    .slice(0, 3)
    .toReversed();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await fetch(`${baseUrl}/api/sign-out`).then((res) => {
        if (res.status === 200) {
          router.refresh();
          toast.success("Signed Out");
        }
      });
    } catch (error) {
      console.error("Sign out failed", error);
      toast.error("Sign Out failed :(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header with profile banner */}
      <div className="relative h-40 sm:h-52 w-full">
        {user?.userDetails?.coverBgUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${coverPicUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-teal-100" />
        )}
        <ImageUploader type="cover" />
      </div>

      {/* Main content container */}
      <div className="mx-auto max-w-3xl md:max-w-5xl px-2 sm:px-4 lg:px-8">
        <div className="relative -mt-16 flex flex-col gap-6">
          {/* Profile header with avatar */}
          <div className="flex flex-col items-center sm:flex-row sm:gap-6">
            <div className="relative">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full border-4 border-background overflow-hidden shadow-lg bg-muted flex items-center justify-center">
                {user?.userDetails?.profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile Picture"
                    className="h-full w-full rounded-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <span className="text-2xl font-semibold text-muted-foreground">
                      {firstLetter}
                    </span>
                  </div>
                )}
              </div>
              <ImageUploader type="profile" />
            </div>
            <div className="mt-2 flex-1 text-center sm:mt-0 sm:text-left">
              <div className="sm:mt-18 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {user?.userDetails
                    ? `${user.userDetails.firstName} ${user.userDetails.lastName}`
                    : ""}
                </h1>
              </div>
              <div className="mt-0 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-muted-foreground sm:justify-start">
                {year && (
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3.5 w-3.5" />
                    {`Member since  ${month} ${year}`}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Daily Nutritional Goals Progress */}
          <DailyNutritionalProgress />

          {/* Profile content cards */}
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent meals card */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-medium flex items-center">
                    <Salad className="h-5 w-5 mr-2" />
                    Recent Meals
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 w-full sm:w-auto"
                  >
                    <Link href={"/meals"}>View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMeals?.map((meal: eachMeal, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-muted/50 gap-2"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <Apple className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <p className="text-sm font-medium">
                          {meal.mealType.charAt(0).toUpperCase() +
                            meal.mealType.slice(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {meal.mealName}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium">
                        {meal.calories} kcal
                      </p>
                      <p className="text-xs text-muted-foreground break-all">
                        {meal.createdAt.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stats card */}
            <Card>
              <CardHeader className="pb-3">
                <h2 className="text-base sm:text-lg font-medium flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Progress Stats
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-2 sm:p-3">
                    <div className="flex items-center text-primary mb-1">
                      <Flame className="h-4 w-4 mr-1" />
                    </div>
                    <span className="text-lg sm:text-2xl font-medium text-primary">
                      {avgCalories}
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      Avg. Daily Calories
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-2 sm:p-3">
                    <div className="flex items-center text-primary mb-1">
                      <Salad className="h-4 w-4 mr-1" />
                    </div>
                    <span className="text-lg sm:text-2xl font-medium text-primary">
                      {user?.userDetails?.foodsLogged.length || ""}
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      Meals Tracked
                    </span>
                  </div>
                  <div className="hover:cursor-not-allowed flex flex-col items-center justify-center rounded-lg bg-muted p-2 sm:p-3">
                    <div className="flex items-center text-primary mb-1">
                      <Timer className="h-4 w-4 mr-1" />
                    </div>
                    <span className="text-lg sm:text-2xl font-medium text-primary">
                      21
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      Days Streak
                    </span>
                  </div>
                  <div className="hover:cursor-not-allowed flex flex-col items-center justify-center rounded-lg bg-muted p-2 sm:p-3">
                    <div className="flex items-center text-primary mb-1">
                      <LineChart className="h-4 w-4 mr-1" />
                    </div>
                    <span className="text-lg sm:text-2xl font-medium text-primary">
                      -3.5
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      lbs This Month
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal nutrition preferences */}
            <NutritionalPreferences />
          </div>
          <div className="w-full text-center mt-6">
            <Button
              className="w-full sm:w-80 hover:cursor-pointer"
              variant={"destructive"}
              onClick={handleSignOut}
              disabled={isLoading}
            >
              {loading ? (
                <>
                  Signing Out
                  <Oval
                    visible={loading}
                    height="24"
                    width="24"
                    strokeWidth="5"
                    color="#FFFFFF"
                    secondaryColor="#FFFFFF"
                    ariaLabel="oval-loading"
                  />
                </>
              ) : (
                <>
                  <LogOut />
                  Sign Out
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

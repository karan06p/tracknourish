"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  TrendingUp,
  TrendingDown,
  Utensils,
  Activity,
  PieChart,
  ForkKnife,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { eachMeal } from "@/types/Meal";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user, firstLetter, isLoading, isError } = useUser();
  const [avgCalories, setAvgCalories] = useState<number | undefined>()
  const [protein, setProtein] = useState<number | undefined>();
  const [fiber, setFiber] = useState<number | undefined>();
  const [profilePicUrl, setProfilePicUrl] = useState<string | undefined>();
  const router = useRouter();
  
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const allMeals = user?.userDetails?.foodsLogged;
  let mostRecentMeals = allMeals?.toReversed().splice(0,3);
  
  useEffect(() => {
    if(user?.userDetails?.foodsLogged){
      let totalCalories = 0;
      let totalProtein = 0;
      let totalFiber = 0;
      user?.userDetails?.foodsLogged.forEach((item: eachMeal) => {
        const calories = parseFloat(item.calories);
        const protein = parseFloat(item.protein);
        const fiber = parseFloat(item.fiber);
        if(!isNaN(calories)){
          totalCalories += calories;
        }
        if(!isNaN(protein)){
          totalProtein += protein;
        }
        if(!isNaN(fiber)){
          totalFiber += fiber;
        }
      })
      if(user.userDetails?.foodsLogged.length > 0){
        let calculatedAvgCalories = (totalCalories / user.userDetails?.foodsLogged.length).toFixed(2)
        setAvgCalories(Number(calculatedAvgCalories));
      }else {
        setAvgCalories(0)
      }
      setProtein(totalProtein);
      setFiber(totalFiber)
    }
    if(user?.userDetails?.profilePicUrl){
      setProfilePicUrl(user?.userDetails?.profilePicUrl)
    }
  }, [user])

  if (isLoading) return <p>Loading...</p>;
  if (isError || !user) {
    toast("User not found");
    return <p>Error loading user info</p>;
  };

  const getCaloriesPerDay = (foodsLogged: eachMeal[]) => {
    const caloriesByDay: { [date: string]: number } = {};
    days.forEach(day => {
      caloriesByDay[day] = 0;
    })
    foodsLogged.forEach((meal: eachMeal) => {
      const date = new Date(meal.createdAt);
      const dayNumber = date.getDay();
      const actualDay = days[dayNumber];

      const calories = parseFloat(meal.calories);
      if(!isNaN(calories)){
        caloriesByDay[actualDay] = (caloriesByDay[actualDay] || 0) + calories;
      }
    });

    return Object.entries(caloriesByDay).map(([name, calories]) => ({
      name,
      calories,
    }))
  }

  const getMacrosData = (foodsLogged: eachMeal[]) => {
    const macrosByDay: { [name: string]: { protein: number, carbs: number, fat: number, fiber: number }} = {};
    days.forEach(day => {
      macrosByDay[day] = { protein: 0 , carbs: 0, fat: 0, fiber: 0}
    });

    foodsLogged.forEach((meal: eachMeal) => {
      const date = new Date(meal.createdAt);
      const dayNumber = date.getDay();
      const actualDay = days[dayNumber];

      const protein = parseFloat(meal.protein);
      const carbs = parseFloat(meal.carbohydrates);
      const fat = parseFloat(meal.fat);
      const fiber = parseFloat(meal.fiber);

      if(!isNaN(protein)) macrosByDay[actualDay].protein += protein;
      if(!isNaN(carbs)) macrosByDay[actualDay].carbs += carbs;
      if(!isNaN(fat)) macrosByDay[actualDay].fat += fat;
      if(!isNaN(fiber)) macrosByDay[actualDay].fiber += fiber;
    });

    return days.map(day => ({
      name: day,
      protein: macrosByDay[day].protein,
      carbs: macrosByDay[day].carbs,
      fat: macrosByDay[day].fat,
      fiber: macrosByDay[day].fiber,
    }))
  }

  const getPieData = (foodLogged: eachMeal[]) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalFiber = 0;

    const recentMeals = foodLogged.filter(meal => {
    const mealDate = new Date(meal.createdAt);
    return mealDate >= sevenDaysAgo && mealDate <= today;
  });

  if (recentMeals.length > 0) {
    recentMeals.forEach((meal: eachMeal) => {
      const carbs = parseFloat(meal.carbohydrates);
      const protein = parseFloat(meal.protein);
      const fat = parseFloat(meal.fat);
      const fiber = parseFloat(meal.fiber);

      if (!isNaN(carbs)) totalCarbs += carbs;
      if (!isNaN(protein)) totalProtein += protein;
      if (!isNaN(fat)) totalFat += fat;
      if (!isNaN(fiber)) totalFiber += fiber;
    });

    return [
      { name: "Carbs", value: totalCarbs, color: "#e6564c" },
      { name: "Protein", value: totalProtein, color: "#8884d8" },
      { name: "Fat", value: totalFat, color: "#ffc658" },
      { name: "Fiber", value: totalFiber, color: "#82ca9d" }
    ].filter(macro => macro.value > 0);
  }

  return [];
};

  const caloriesData = getCaloriesPerDay(user?.userDetails?.foodsLogged || []);

  const macrosData = getMacrosData(user?.userDetails?.foodsLogged || [])

  const pieData = getPieData(user?.userDetails?.foodsLogged || [])

  // Chart config
  const chartConfig = {
    calories: { label: "Calories", color: "#FF6384" },
    protein: { label: "Protein", color: "#8884d8" },
    carbs: { label: "Carbs", color: "#e6564c" },
    fat: { label: "Fat", color: "#ffc658" },
    fiber: { label: "Fiber", color: "#82ca9d" },
  };

  return (
    <div className="min-h-screen bg-gray-50/70">
      {/* Dashboard header with gradient */}
      <div className="bg-gradient-to-r from-blue-500/90 to-indigo-600/90 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-white sm:text-3xl">
                Welcome back, {user.userDetails?.firstName}
              </h1>
              <p className="mt-2 text-sm text-blue-100">
                Track your nutrition journey and stay healthy
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-5 justify-center items-center">
              <Button className="hover:bg-black hover:text-white bg-white text-black flex items-center gap-2 shadow-sm" onClick={() => router.push("/meals")}>
                <ForkKnife className="h-4 w-4" />
                Track Meal 
              </Button>
              <Link href={"/profile"}>
              <Avatar className="hover:shadow-2xl hover:shadow-accent">
                <AvatarImage src={profilePicUrl} />
                <AvatarFallback>{firstLetter}</AvatarFallback>
              </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats overview with subtle animations */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
  {/* Card 1 */}
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
    <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
      <div>
        <CardDescription>Meals tracked</CardDescription>
        <CardTitle className="text-3xl">{user?.userDetails?.foodsLogged.length}</CardTitle>
      </div>
      <Utensils className="h-5 w-5 text-blue-500" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500 font-medium">+12%</span> from last week
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Card 2 */}
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
    <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
      <div>
        <CardDescription>Average calories</CardDescription>
        <CardTitle className="text-3xl">{avgCalories || 0}</CardTitle>
      </div>
      <Activity className="h-5 w-5 text-rose-500" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        <TrendingDown className="mr-1 h-4 w-4 text-rose-500" />
        <p className="text-xs text-muted-foreground">
          <span className="text-rose-500 font-medium">+3%</span> from last week
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Card 3 */}
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
    <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
      <div>
        <CardDescription>Protein intake (g)</CardDescription>
        <CardTitle className="text-3xl">{protein}</CardTitle>
      </div>
      <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
        <span className="text-xs font-bold text-indigo-600">P</span>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500 font-medium">+7%</span> from last week
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Card 4 */}
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
    <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
      <div>
        <CardDescription>Fiber intake (g)</CardDescription>
        <CardTitle className="text-3xl">{fiber}</CardTitle>
      </div>
      <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
        <span className="text-xs font-bold text-green-600">F</span>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500 font-medium">+2%</span> from last week
        </p>
      </div>
    </CardContent>
  </Card>
</div>


          {/* Nutrition trends with real charts */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Nutrition Trends</CardTitle>
                  <CardDescription>
                    Track your nutrition patterns over the <b>past</b>  week
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calories">
                <TabsList className="mb-4">
                  <TabsTrigger value="calories">
                    <BarChartIcon className="h-4 w-4 mr-2" />
                    Calories
                  </TabsTrigger>
                  <TabsTrigger value="macros">
                    <LineChartIcon className="h-4 w-4 mr-2" />
                    Macros
                  </TabsTrigger>
                  <TabsTrigger value="breakdown">
                    <PieChart className="h-4 w-4 mr-2" />
                    Breakdown
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="calories" className="space-y-4">
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer>
                      <BarChart
                        data={caloriesData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          opacity={0.3}
                        />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="calories"
                          fill="#FF6384"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </TabsContent>

                <TabsContent value="macros" className="space-y-4">
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer>
                      <LineChart
                        data={macrosData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="4 4"
                          vertical={false}
                          opacity={0.3}
                        />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="protein"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="carbs"
                          stroke="#e6564c"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                          <Line
                            type="monotone"
                            dataKey="fiber"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        <Line
                          type="monotone"
                          dataKey="fat"
                          stroke="#ffc658"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </TabsContent>

                <TabsContent value="breakdown" className="space-y-4">
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer>
                      <RechartsPieChart>
                        {pieData && pieData.length > 0 ? (
                          <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        ): (
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                            Track New Meals!
                          </text>
                        )}
                        
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent meals section with improved styling */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Meals</CardTitle>
                  <CardDescription>
                    Your most recently logged meals
                  </CardDescription>
                </div>
                <Link href="/meals">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {mostRecentMeals?.map((item: eachMeal, idx: number) => (
                  <div className="p-4 border-b hover:bg-gray-50 transition-colors" key={idx}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full 
                          ${item.mealType === "breakfast" ? "bg-green-500": ""}
                          ${item.mealType === "lunch" ? "bg-yellow-500": ""}
                          ${item.mealType === "snack" ? "bg-blue-600": ""}
                          ${item.mealType === "dinner" ? "bg-purple-500": ""}
                          `}></span>
                        {item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.mealName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600">{item.calories} kcal</p>
                      <p className="text-sm text-gray-500">
                        P: {item.protein} | C: {item.carbohydrates} | F: {item.fat}
                      </p>
                    </div>
                  </div>
                </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

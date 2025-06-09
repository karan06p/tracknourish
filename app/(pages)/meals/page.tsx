"use client";

import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Filter, Search, Loader, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { NutritionalSummary } from "@/components/NutritionalSummary";
import RecentMealCard from "@/components/RecentMealCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@/hooks/use-user";
import { eachMeal, Id, NutrientItem, SearchResults } from "@/types/Meal";
import TableRowComponent from "@/components/TableRow";
import { LineWave } from "react-loader-spinner";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

const MemoizedMealCard = memo(RecentMealCard);

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Meal categories with their respective colors
const MEAL_CATEGORIES = {
  breakfast: { label: "Breakfast", color: "bg-blue-50", icon: "☕" },
  lunch: { label: "Lunch", color: "bg-green-50", icon: "🍲" },
  dinner: { label: "Dinner", color: "bg-orange-50", icon: "🍽️" },
  snack: { label: "Snack", color: "bg-purple-50", icon: "🥨" },
};

const trackMealformSchema = z.object({
  mealName: z.string().min(2, {
    message: "Meal name must be atleast 2 characters",
  }),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  description: z
    .string()
    .max(80, {
      message: "Description cannot be more than 80 characters",
    })
    .optional(),
  calories: z.string(),
  protein: z.string(),
  carbohydrates: z.string(),
  fat: z.string(),
  fiber: z.string(),
  tags: z.string().array().optional(),
});

const MealsPage = () => {
  const { user, isError, mutate } = useUser();
  const router = useRouter();
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [recentMeals, setRecentMeals] = useState<eachMeal[] | undefined>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterMealType, setFilterMealType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>();
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const [totalCalories, setTotalCalories] = useState<number | undefined>();
  const [totalProtein, setTotalProtein] = useState<number | undefined>();
  const [totalCarbohydratess, setTotalCarbohydrates] = useState<
    number | undefined
  >();
  const [showNutritionalSummary, setShowNutritionalSummary] =
    useState<boolean>(false);
  const [mealsLength, setMealsLength] = useState<number | undefined>();

  if (isError) return <div>Error Loading Component, Please Refresh</div>;

  useEffect(() => {
    if (user?.userDetails?.foodsLogged) {
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbohydratess = 0;
      const totalMeals = user?.userDetails?.foodsLogged;
      const totalMealsLength = totalMeals.length;
      user.userDetails?.foodsLogged.forEach((item: eachMeal) => {
        const calories = parseFloat(item.calories);
        const protein = parseFloat(item.protein);
        const carbohydrates = parseFloat(item.carbohydrates);
        if (!isNaN(calories)) {
          totalCalories += calories;
        }
        if (!isNaN(protein)) {
          totalProtein += protein;
        }
        if (!isNaN(carbohydrates)) {
          totalCarbohydratess += carbohydrates;
        }
      });
      setTotalCalories(totalCalories);
      setTotalProtein(totalProtein);
      setTotalCarbohydrates(totalCarbohydratess);
      setMealsLength(totalMealsLength);
      setShowNutritionalSummary(true);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.userDetails?.foodsLogged) {
      setRecentMeals([]);
      return;
    }
    let meals = [...user.userDetails?.foodsLogged];

    // Filter by meal type if not "all"
    if (filterMealType !== "all") {
      meals = meals.filter((meal) => meal.mealType === filterMealType);
    }

    // Sort by newest/oldest
    if (sortBy === "newest") meals = meals.toReversed();

    setRecentMeals(meals);
  }, [user, sortBy, filterMealType]);

  const processedMeals = useMemo(() => {
    if (!user?.userDetails?.foodsLogged) return [];

    let meals = [...user.userDetails?.foodsLogged];

    // Apply filters
    if (filterMealType !== "all") {
      meals = meals.filter((meal) => meal.mealType === filterMealType);
    }

    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      meals = meals.filter(
        (meal) =>
          meal.mealName.toLowerCase().includes(query) ||
          (meal.description && meal.description.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    if (sortBy === "newest") {
      meals = meals.toReversed();
    }

    return meals;
  }, [user?.userDetails?.foodsLogged, filterMealType, debouncedQuery, sortBy]);

  // Memoize nutrient calculations
  const calculateNutrients = useCallback(
    (meal: eachMeal) => [
      {
        name: "Protein",
        amount: parseFloat(meal.protein),
        unit: "g",
      },
      {
        name: "Carbohydrates",
        amount: parseFloat(meal.carbohydrates),
        unit: "g",
      },
      {
        name: "Fiber",
        amount: parseFloat(meal.fiber),
        unit: "g",
      },
      {
        name: "Fat",
        amount: parseFloat(meal.fat),
        unit: "g",
      },
    ],
    []
  );

  const debouncedSetQuery = useMemo(
    () => debounce((val: string) => setDebouncedQuery(val), 300),
    []
  );

  // Optimize search input handler
  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      debouncedSetQuery(e.target.value);
    },
    [debouncedSetQuery]
  );

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const form = useForm<z.infer<typeof trackMealformSchema>>({
    resolver: zodResolver(trackMealformSchema),
    defaultValues: {
      mealName: "",
      mealType: "breakfast",
      description: "",
      calories: "",
      protein: "",
      carbohydrates: "",
      fat: "",
      fiber: "",
      tags: [],
    },
  });

  const trackNewMeal = async (values: z.infer<typeof trackMealformSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/log-meal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
      if (res.status === 200) {
        toast.success("New meal added successfully.");
        mutate();
      } else {
        toast.error(`Error while adding new meal: ${res.statusText}`);
      }
    } catch (error) {
      toast.error("Unexpected error occurred while adding new meal.");
      console.error("Error while adding new meal:", error);
    } finally {
      const mealTime = new Date();
      const mealHour: number = mealTime.getHours();
      if (mealHour >= 4 && mealHour <= 13) {
        form.setValue("mealType", "breakfast");
      } else if (mealHour >= 13 && mealHour <= 17) {
        form.setValue("mealType", "lunch");
      } else if (mealHour > 17 && mealHour <= 19) {
        form.setValue("mealType", "snack");
      } else if (mealHour > 19 && mealHour < 4) {
        form.setValue("mealType", "dinner");
      } else {
        form.setValue("mealType", "breakfast");
      }
      setIsLoading(false);
      setShowAddMealForm(false);
      form.setValue("mealName", "");
      form.setValue("description", "");
      form.setValue("calories", "");
      form.setValue("protein", "");
      form.setValue("carbohydrates", "");
      form.setValue("fat", "");
      form.setValue("fiber", "");
      setSearchResults([]);
      mutate();
    }
  };

  const handleDeleteMeal = async (id: Id) => {
    try {
      const res = await fetch(`${baseUrl}/api/delete-meal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealId: id,
        }),
      });
      if (res.status === 200) {
        mutate();
        toast.success("Meal deleted successfully");
      } else {
        toast.error(res.statusText);
      }
      return;
    } catch (error) {
      console.error("Meal deletion unsuccessfull", error);
      toast.error("Meal deletion failed");
    } finally {
      mutate();
    }
  };

  const onSelectFood = async (food: SearchResults) => {
    setIsLoading(true);
    setIsPopoverOpen(false);
    try {
      const res = await fetch(`${baseUrl}/api/food-nutrients/${food.id}`);
      if (res.status === 402) {
        toast.error("Daily API limit reached. Please try again tomorrow.");
        return;
      }
      if (res.status === 429) {
        toast.error("Rate limit exceeded. Please try again after a minute.");
        return;
      }
      if (!res.ok) {
        toast.error(`Error while fetching nutrients: ${res.statusText}`);
        return;
      }
      const data = await res.json();
      const { calories, protein, carbs, fat, good } = data;
      const fiberEntry = good.find(
        (item: NutrientItem) => item.title.toLowerCase() === "fiber"
      );
      const fiber = fiberEntry ? fiberEntry.amount : "";

      // Set values in react-hook-form
      form.setValue("mealName", food.title || "");
      form.setValue("calories", calories || "");
      form.setValue("protein", protein || "");
      form.setValue("carbohydrates", carbs || "");
      form.setValue("fat", fat || "");
      form.setValue("fiber", fiber || "");
    } catch (error) {
      toast.error("Unexpected error occurred while fetching nutrients.");
      console.error("Error in fetching nutrients of the selected food:", error);
    } finally {
      setIsLoading(false);
      setSearchResults([]);
    }
  };

  const handleInputValue = async (searchTerm: string) => {
    setIsPopoverOpen(true);
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/search-meal?query=${searchTerm}`);
      if (res.status === 402) {
        toast.error("Daily API limit reached. Please try again tomorrow.");
        return;
      }
      if (res.status === 429) {
        toast.error("Rate limit exceeded. Please try again after a minute.");
        return;
      }
      if (!res.ok) {
        toast.error(`Error while fetching meals: ${res.statusText}`);
        setSearchResults([]);
        return;
      }
      const data = await res.json();
      if (!data || !data.results) {
        toast.error("No meals found for the given search term.");
        setSearchResults([]);
        return;
      }
      setSearchResults(data.results);
    } catch (err) {
      toast.error("Unexpected error occurred while fetching meals.");
      console.error("Failed to fetch meals:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMeals = useMemo(
    () =>
      (recentMeals ?? []).filter(
        (meal) =>
          meal.mealName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          (meal.description &&
            meal.description
              .toLowerCase()
              .includes(debouncedQuery.toLowerCase()))
      ),
    [recentMeals, debouncedQuery]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-10 px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="w-full flex items-center justify-between gap-4">
            <Button
              className="hover:cursor-pointer"
              variant="outline"
              size="icon"
              onClick={() => router.replace("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden sm:flex items-center gap-2 hover:cursor-pointer"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button
                onClick={() => setShowAddMealForm(true)}
                className="bg-gradient-to-r from-primary to-primary/80 hover:cursor-pointer"
              >
                <Plus className=" h-4 w-4" />
                Track New Meal
              </Button>
            </div>
          </div>
        </div>
        {showNutritionalSummary && (
          <NutritionalSummary
            totalsMeals={mealsLength}
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            totalCarbs={totalCarbohydratess}
          />
        )}

        {/* Filter Section */}
        {showFilters && (
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle>Filter & Sort</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mealType">Meal Type</Label>
                  <Select
                    value={filterMealType}
                    onValueChange={setFilterMealType}
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="hover:cursor-pointer" value="all">
                        All Meals
                      </SelectItem>
                      <SelectItem
                        className="hover:cursor-pointer"
                        value="breakfast"
                      >
                        Breakfast
                      </SelectItem>
                      <SelectItem
                        className="hover:cursor-pointer"
                        value="lunch"
                      >
                        Lunch
                      </SelectItem>
                      <SelectItem
                        className="hover:cursor-pointer"
                        value="dinner"
                      >
                        Dinner
                      </SelectItem>
                      <SelectItem
                        className="hover:cursor-pointer"
                        value="snack"
                      >
                        Snack
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortBy">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        className="hover:cursor-pointer"
                        value="newest"
                      >
                        Newest First
                      </SelectItem>
                      <SelectItem
                        className="hover:cursor-pointer"
                        value="oldest"
                      >
                        Oldest First
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={handleSearchInput}
                      className="pl-10"
                      placeholder="Search for a meal..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Meal Form */}
        {showAddMealForm && (
          <Card className="mb-8 animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 py-4 rounded">
              <CardTitle>Track a New Meal</CardTitle>
              <CardDescription>
                Enter the details of your meal to track its nutrients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Track Meal form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(trackNewMeal)}>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name="mealName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meal Name</FormLabel>
                              <FormControl>
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="relative flex-1">
                                    <Popover open={isPopoverOpen}>
                                      <PopoverTrigger asChild>
                                        <div className="relative w-full">
                                          <Input
                                            {...field}
                                            className="pl-3 pr-10 truncate"
                                            autoComplete="off"
                                            placeholder="pancake"
                                            onFocus={() =>
                                              setIsPopoverOpen(false)
                                            }
                                          />
                                          {isLoading ? (
                                            <Loader className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                          ) : (
                                            <div className="absolute right-3 top-2.5 h-5 w-5 flex items-center">
                                              <span className="group relative">
                                                <Search
                                                  className="h-5 w-5 text-primary cursor-pointer group-hover:scale-110 transition-transform"
                                                  onClick={() =>
                                                    handleInputValue(
                                                      field.value
                                                    )
                                                  }
                                                />
                                                <span className="absolute z-10 left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                  Click to search
                                                </span>
                                              </span>
                                            </div>
                                          )}
                                          {field.value && (
                                            <button
                                              type="button"
                                              className="bg-white truncate absolute right-10 top-2.5 h-5 w-7 flex items-center justify-end "
                                              onClick={() => {
                                                field.onChange("");
                                                setIsPopoverOpen(false);
                                              }}
                                            >
                                              <X className="h-5 w-5 hover:bg-gray-300 rounded-full" />
                                            </button>
                                          )}
                                        </div>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-full p-0"
                                        align="start"
                                      >
                                        <div className="max-h-[300px] overflow-y-auto rounded-b-md bg-white">
                                          <div className="flex items-center justify-start">
                                            <p className="font-light text-sm px-2">
                                              powered by Spoonacular
                                            </p>
                                          </div>

                                          {isLoading ? (
                                            <div className="w-full flex justify-center items-center">
                                              <LineWave
                                                visible={true}
                                                height="100"
                                                width="100"
                                                color="#f0fdf4"
                                                ariaLabel="line-wave-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                                firstLineColor=""
                                                middleLineColor=""
                                                lastLineColor=""
                                              />
                                            </div>
                                          ) : searchResults.length > 0 ? (
                                            <div>
                                              {searchResults.map((food) => (
                                                <button
                                                  key={food.id}
                                                  onClick={() =>
                                                    onSelectFood(food)
                                                  }
                                                  className="w-full cursor-pointer items-center justify-between px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                                >
                                                  <div className="font-medium">
                                                    {food.title}
                                                  </div>
                                                </button>
                                              ))}
                                            </div>
                                          ) : (
                                            <div className="w-full flex justify-center items-center">
                                              <p className="text-center p-2">
                                                No results found
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="min-w-[180px]">
                        <FormField
                          control={form.control}
                          name="mealType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meal Type</FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger
                                    id="mealType"
                                    className="w-56 sm:w-fit"
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="w-56 sm:w-fit">
                                    <SelectItem value="breakfast">
                                      <div className="flex items-center gap-2">
                                        <span>
                                          {MEAL_CATEGORIES.breakfast.icon}
                                        </span>
                                        <span>Breakfast</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="lunch">
                                      <div className="flex items-center gap-2">
                                        <span>
                                          {MEAL_CATEGORIES.lunch.icon}
                                        </span>
                                        <span>Lunch</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="dinner">
                                      <div className="flex items-center gap-2">
                                        <span>
                                          {MEAL_CATEGORIES.dinner.icon}
                                        </span>
                                        <span>Dinner</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="snack">
                                      <div className="flex items-center gap-2">
                                        <span>
                                          {MEAL_CATEGORIES.snack.icon}
                                        </span>
                                        <span>Snack</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your meal..."
                                {...field}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-4 flex-wrap">
                        <FormField
                          control={form.control}
                          name="calories"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Calories</FormLabel>
                              <FormControl>
                                <Input
                                  type="string"
                                  placeholder="kcal"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="protein"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Protein (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="string"
                                  placeholder="g"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="carbohydrates"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Carbs (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="string"
                                  placeholder="g"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fat (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="string"
                                  placeholder="g"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fiber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fiber (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="string"
                                  placeholder="g"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    {/* Tags */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex-col space-y-2 my-2">
                              {(field.value ?? []).length === 0 ? (
                                <div className="flex justify-start">
                                  <Button
                                    className="hover:cursor-pointer"
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => field.onChange([""])}
                                  >
                                    <Plus />
                                    Add Tag
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <FormLabel>Tags</FormLabel>
                                  {(field.value ?? []).map((tag, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      <Input
                                        placeholder="e.g. high-protein, vegetarian"
                                        className="flex-1"
                                        value={tag}
                                        onChange={(e) => {
                                          const newTags = [
                                            ...(field.value ?? []),
                                          ];
                                          newTags[index] = e.target.value;
                                          field.onChange(newTags);
                                        }}
                                      />
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        type="button"
                                        onClick={() => {
                                          const newTags = [
                                            ...(field.value ?? []),
                                          ];
                                          newTags.splice(index, 1);
                                          field.onChange(newTags);
                                        }}
                                        className="h-8 w-8 flex-shrink-0"
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      field.onChange([
                                        ...(field.value ?? []),
                                        "",
                                      ])
                                    }
                                  >
                                    Add Tag
                                  </Button>
                                </>
                              )}
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddMealForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Track Meal</Button>
                  </CardFooter>{" "}
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Recent Meals Section */}
        <div className="mb-8">
          <div className="w-full flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold ">Recent Meals</h2>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center sm:hidden gap-2"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          {filteredMeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white p-12 rounded-lg border border-dashed border-gray-300">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-medium mb-2 text-center">
                No meals found
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {filterMealType !== "all" || searchQuery
                  ? "Try changing your filters or search query"
                  : "Start tracking your meals to see them here"}
              </p>
              <Button onClick={() => setShowAddMealForm(true)}>
                <Plus className="h-4 w-4 mr-2" /> Track Your First Meal
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {processedMeals
                .slice(0, 6)
                .map((meal: eachMeal, index: number) => {
                  const date = new Date(meal.createdAt);
                  const day = date.getDay();
                  const dayName = days[day];
                  return (
                    <MemoizedMealCard
                      key={index}
                      id={meal._id}
                      mealTypeColor={
                        MEAL_CATEGORIES[
                          meal.mealType as keyof typeof MEAL_CATEGORIES
                        ].color
                      }
                      mealTypeIcon={
                        MEAL_CATEGORIES[
                          meal.mealType as keyof typeof MEAL_CATEGORIES
                        ].icon
                      }
                      mealName={meal.mealName}
                      mealTypeLabel={
                        MEAL_CATEGORIES[
                          meal.mealType as keyof typeof MEAL_CATEGORIES
                        ].label
                      }
                      mealCalories={meal.calories}
                      description={meal.description || ""}
                      tags={meal.tags || []}
                      nutrients={calculateNutrients(meal)}
                      day={dayName}
                      onDelete={handleDeleteMeal}
                    />
                  );
                })}
            </div>
          )}
        </div>

        {/* All Meals Table View */}
        <Card>
          <CardHeader>
            <CardTitle>All Meals</CardTitle>
            <CardDescription>
              Comprehensive view of all your tracked meals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meal</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Protein</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeals?.map((meal: eachMeal, index: number) => {
                    const nutrients = [
                      {
                        name: "Protein",
                        amount: parseFloat(meal.protein),
                        unit: "g",
                      },
                      {
                        name: "Carbohydrates",
                        amount: parseFloat(meal.carbohydrates.slice(0, -1)),
                        unit: "g",
                      },
                      {
                        name: "Fiber",
                        amount: parseFloat(meal.fiber.slice(0, -1)),
                        unit: "g",
                      },
                      {
                        name: "Fat",
                        amount: parseFloat(meal.fat.slice(0, -1)),
                        unit: "g",
                      },
                    ];
                    return (
                      <TableRowComponent
                        key={index}
                        mealName={meal.mealName}
                        mealType={meal.mealType}
                        mealIcon={
                          MEAL_CATEGORIES[
                            meal.mealType as keyof typeof MEAL_CATEGORIES
                          ].icon
                        }
                        mealId={meal._id}
                        createdAt={meal.createdAt.slice(0, 10)}
                        handleDeleteFunction={handleDeleteMeal}
                        protein={
                          nutrients.find((item) => item.name === "Protein")
                            ?.amount
                        }
                        calories={meal.calories}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default MealsPage;

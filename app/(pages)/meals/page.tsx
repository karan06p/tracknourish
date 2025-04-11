"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Filter, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

// Meal type definition
interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds?: number;
}

interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  mealType: string;
  dateAdded: Date;
  nutrients: Nutrient[];
  tags?: string[];
}

// Sample data for the nutrients chart
const NUTRIENT_COLORS = {
  protein: "#4ade80",
  carbs: "#3b82f6",
  fat: "#f97316",
  others: "#8b5cf6",
};

// Meal categories with their respective colors
const MEAL_CATEGORIES = {
  breakfast: { label: "Breakfast", color: "bg-blue-50", icon: "☕" },
  lunch: { label: "Lunch", color: "bg-green-50", icon: "🍲" },
  dinner: { label: "Dinner", color: "bg-orange-50", icon: "🍽️" },
  snack: { label: "Snack", color: "bg-purple-50", icon: "🥨" },
};

const MealsPage = () => {
  const router = useRouter();
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterMealType, setFilterMealType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Sample data for meals
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: "1",
      name: "Chicken Salad",
      description: "Grilled chicken breast with mixed greens, cherry tomatoes, and balsamic vinaigrette",
      calories: 350,
      mealType: "lunch",
      dateAdded: new Date(),
      tags: ["high-protein", "low-carb"],
      nutrients: [
        { name: "Protein", amount: 30, unit: "g", percentOfDailyNeeds: 60 },
        { name: "Carbohydrates", amount: 15, unit: "g", percentOfDailyNeeds: 5 },
        { name: "Fat", amount: 18, unit: "g", percentOfDailyNeeds: 28 },
        { name: "Fiber", amount: 4, unit: "g", percentOfDailyNeeds: 16 },
      ],
    },
    {
      id: "2",
      name: "Oatmeal with Berries",
      description: "Steel-cut oats with mixed berries, almond milk, and a touch of honey",
      calories: 280,
      mealType: "breakfast",
      dateAdded: new Date(Date.now() - 86400000), // 1 day ago
      tags: ["high-fiber", "vegetarian"],
      nutrients: [
        { name: "Protein", amount: 8, unit: "g", percentOfDailyNeeds: 16 },
        { name: "Carbohydrates", amount: 45, unit: "g", percentOfDailyNeeds: 15 },
        { name: "Fat", amount: 6, unit: "g", percentOfDailyNeeds: 9 },
        { name: "Fiber", amount: 7, unit: "g", percentOfDailyNeeds: 28 },
      ],
    },
    {
      id: "3",
      name: "Salmon with Asparagus",
      description: "Baked salmon with roasted asparagus and lemon butter sauce",
      calories: 420,
      mealType: "dinner",
      dateAdded: new Date(Date.now() - 172800000), // 2 days ago
      tags: ["high-protein", "omega-3"],
      nutrients: [
        { name: "Protein", amount: 35, unit: "g", percentOfDailyNeeds: 70 },
        { name: "Carbohydrates", amount: 10, unit: "g", percentOfDailyNeeds: 3 },
        { name: "Fat", amount: 25, unit: "g", percentOfDailyNeeds: 38 },
        { name: "Fiber", amount: 3, unit: "g", percentOfDailyNeeds: 12 },
      ],
    },
    {
      id: "4",
      name: "Greek Yogurt with Honey",
      description: "Plain Greek yogurt with a drizzle of honey and mixed nuts",
      calories: 180,
      mealType: "snack",
      dateAdded: new Date(Date.now() - 259200000), // 3 days ago
      tags: ["high-protein", "quick"],
      nutrients: [
        { name: "Protein", amount: 15, unit: "g", percentOfDailyNeeds: 30 },
        { name: "Carbohydrates", amount: 12, unit: "g", percentOfDailyNeeds: 4 },
        { name: "Fat", amount: 8, unit: "g", percentOfDailyNeeds: 12 },
        { name: "Fiber", amount: 1, unit: "g", percentOfDailyNeeds: 4 },
      ],
    },
    {
      id: "5",
      name: "Vegetable Stir Fry",
      description: "Mixed vegetables stir-fried with tofu in sesame oil",
      calories: 310,
      mealType: "dinner",
      dateAdded: new Date(Date.now() - 345600000), // 4 days ago
      tags: ["vegetarian", "low-calorie"],
      nutrients: [
        { name: "Protein", amount: 18, unit: "g", percentOfDailyNeeds: 36 },
        { name: "Carbohydrates", amount: 28, unit: "g", percentOfDailyNeeds: 9 },
        { name: "Fat", amount: 15, unit: "g", percentOfDailyNeeds: 23 },
        { name: "Fiber", amount: 8, unit: "g", percentOfDailyNeeds: 32 },
      ],
    },
  ]);

  const [newMeal, setNewMeal] = useState({
    name: "",
    description: "",
    calories: "",
    mealType: "breakfast",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    tags: [""] as string[],
  });

  // Filter and sort the meals
  const filteredMeals = meals.filter(meal => {
    // Filter by meal type
    if (filterMealType !== "all" && meal.mealType !== filterMealType) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !meal.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort the meals
  const sortedMeals = [...filteredMeals].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    } else if (sortBy === "calories-high") {
      return b.calories - a.calories;
    } else if (sortBy === "calories-low") {
      return a.calories - b.calories;
    }
    return 0;
  });

  // Paginate the meals
  const indexOfLastMeal = currentPage * itemsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - itemsPerPage;
  const currentMeals = sortedMeals.slice(indexOfFirstMeal, indexOfLastMeal);
  const totalPages = Math.ceil(sortedMeals.length / itemsPerPage);

  // Calculate nutritional summary for all meals
  const nutritionalSummary = meals.reduce(
    (summary, meal) => {
      summary.totalCalories += meal.calories;
      meal.nutrients.forEach((nutrient) => {
        if (nutrient.name === "Protein") {
          summary.totalProtein += nutrient.amount;
        } else if (nutrient.name === "Carbohydrates") {
          summary.totalCarbs += nutrient.amount;
        } else if (nutrient.name === "Fat") {
          summary.totalFat += nutrient.amount;
        }
      });
      return summary;
    },
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  );

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.calories) {
      toast.error("Please fill in the required fields");
      return;
    }

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      description: newMeal.description,
      calories: parseInt(newMeal.calories),
      mealType: newMeal.mealType,
      dateAdded: new Date(),
      tags: newMeal.tags.filter(tag => tag !== ""),
      nutrients: [
        { name: "Protein", amount: parseInt(newMeal.protein) || 0, unit: "g", percentOfDailyNeeds: ((parseInt(newMeal.protein) || 0) / 50) * 100 },
        { name: "Carbohydrates", amount: parseInt(newMeal.carbs) || 0, unit: "g", percentOfDailyNeeds: ((parseInt(newMeal.carbs) || 0) / 300) * 100 },
        { name: "Fat", amount: parseInt(newMeal.fat) || 0, unit: "g", percentOfDailyNeeds: ((parseInt(newMeal.fat) || 0) / 65) * 100 },
        { name: "Fiber", amount: parseInt(newMeal.fiber) || 0, unit: "g", percentOfDailyNeeds: ((parseInt(newMeal.fiber) || 0) / 25) * 100 },
      ],
    };

    setMeals([meal, ...meals]);
    setNewMeal({
      name: "",
      description: "",
      calories: "",
      mealType: "breakfast",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
      tags: [""],
    });
    setShowAddMealForm(false);
    toast.success("Meal added successfully!");
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
    toast.success("Meal deleted successfully");
  };

  const handleAddTag = () => {
    setNewMeal({ ...newMeal, tags: [...newMeal.tags, ""] });
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedTags = [...newMeal.tags];
    updatedTags[index] = value;
    setNewMeal({ ...newMeal, tags: updatedTags });
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = newMeal.tags.filter((_, i) => i !== index);
    setNewMeal({ ...newMeal, tags: updatedTags });
  };

  const getNutrientChartData = (nutrients: Nutrient[]) => {
    return nutrients.map((nutrient) => ({
      name: nutrient.name,
      value: nutrient.amount,
      percentage: nutrient.percentOfDailyNeeds,
    }));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-24 px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Meal Tracker</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)} 
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button onClick={() => setShowAddMealForm(true)} className="bg-gradient-to-r from-primary to-primary/80">
              <Plus className="mr-2 h-4 w-4" /> Track New Meal
            </Button>
          </div>
        </div>

        {/* Nutritional Summary Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nutritional Summary</CardTitle>
            <CardDescription>Overview of your tracked meals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600 mb-1">Total Meals</h3>
                <p className="text-2xl font-bold">{meals.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600 mb-1">Total Calories</h3>
                <p className="text-2xl font-bold">{nutritionalSummary.totalCalories} kcal</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600 mb-1">Total Protein</h3>
                <p className="text-2xl font-bold">{nutritionalSummary.totalProtein} g</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600 mb-1">Total Carbs</h3>
                <p className="text-2xl font-bold">{nutritionalSummary.totalCarbs} g</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <Select value={filterMealType} onValueChange={setFilterMealType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Meals</SelectItem>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortBy">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="calories-high">Calories (High to Low)</SelectItem>
                      <SelectItem value="calories-low">Calories (Low to High)</SelectItem>
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
                      onChange={(e) => setSearchQuery(e.target.value)}
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
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle>Track a New Meal</CardTitle>
              <CardDescription>Enter the details of your meal to track its nutrients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Meal Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="e.g. Chicken Salad"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mealType">Meal Type</Label>
                  <Select
                    value={newMeal.mealType}
                    onValueChange={(value) => setNewMeal({ ...newMeal, mealType: value })}
                  >
                    <SelectTrigger id="mealType">
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">
                        <div className="flex items-center gap-2">
                          <span>{MEAL_CATEGORIES.breakfast.icon}</span>
                          <span>Breakfast</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="lunch">
                        <div className="flex items-center gap-2">
                          <span>{MEAL_CATEGORIES.lunch.icon}</span>
                          <span>Lunch</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dinner">
                        <div className="flex items-center gap-2">
                          <span>{MEAL_CATEGORIES.dinner.icon}</span>
                          <span>Dinner</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="snack">
                        <div className="flex items-center gap-2">
                          <span>{MEAL_CATEGORIES.snack.icon}</span>
                          <span>Snack</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your meal..."
                  value={newMeal.description}
                  onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories <span className="text-red-500">*</span></Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="kcal"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="g"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="g"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    placeholder="g"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiber">Fiber (g)</Label>
                  <Input
                    id="fiber"
                    type="number"
                    placeholder="g"
                    value={newMeal.fiber}
                    onChange={(e) => setNewMeal({ ...newMeal, fiber: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tags</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button" 
                    onClick={handleAddTag}
                    className="h-8 text-xs"
                  >
                    + Add Tag
                  </Button>
                </div>
                <div className="space-y-2">
                  {newMeal.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        placeholder="e.g. high-protein, vegetarian"
                        className="flex-1"
                      />
                      {index > 0 && (
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="h-10 w-10 flex-shrink-0"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowAddMealForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMeal}>Track Meal</Button>
            </CardFooter>
          </Card>
        )}

        {/* Recent Meals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Meals</h2>
            {!showAddMealForm && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddMealForm(true)}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Quick Add
              </Button>
            )}
          </div>

          {currentMeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white p-12 rounded-lg border border-dashed border-gray-300">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-medium mb-2 text-center">No meals found</h3>
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
              {currentMeals.map((meal) => (
                <Card key={meal.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className={`${
                    MEAL_CATEGORIES[meal.mealType as keyof typeof MEAL_CATEGORIES].color
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span>{MEAL_CATEGORIES[meal.mealType as keyof typeof MEAL_CATEGORIES].icon}</span>
                          {meal.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          <span className="capitalize">{MEAL_CATEGORIES[meal.mealType as keyof typeof MEAL_CATEGORIES].label}</span> • {meal.calories} kcal • {formatDate(meal.dateAdded)}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-xs bg-white/70 hover:bg-white"
                        onClick={() => handleDeleteMeal(meal.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {meal.description && <p className="text-sm text-gray-600 mb-4">{meal.description}</p>}
                    
                    {meal.tags && meal.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {meal.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/2">
                        <h4 className="text-sm font-medium mb-2">Nutrients</h4>
                        <ul className="space-y-2">
                          {meal.nutrients.map((nutrient, index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span>{nutrient.name}</span>
                              <span className="font-medium">{nutrient.amount}{nutrient.unit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="w-full md:w-1/2 h-48">
                        <ChartContainer
                          className="h-48"
                          config={{
                            protein: { color: NUTRIENT_COLORS.protein },
                            carbs: { color: NUTRIENT_COLORS.carbs },
                            fat: { color: NUTRIENT_COLORS.fat },
                            fiber: { color: NUTRIENT_COLORS.others },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={getNutrientChartData(meal.nutrients)}
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={(entry) => `${entry.name}`}
                              >
                                {getNutrientChartData(meal.nutrients).map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={
                                      entry.name === "Protein" ? NUTRIENT_COLORS.protein :
                                      entry.name === "Carbohydrates" ? NUTRIENT_COLORS.carbs :
                                      entry.name === "Fat" ? NUTRIENT_COLORS.fat :
                                      NUTRIENT_COLORS.others
                                    } 
                                  />
                                ))}
                              </Pie>
                              <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* All Meals Table View */}
        <Card>
          <CardHeader>
            <CardTitle>All Meals</CardTitle>
            <CardDescription>Comprehensive view of all your tracked meals</CardDescription>
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
                  {sortedMeals.map((meal) => (
                    <TableRow key={meal.id}>
                      <TableCell className="font-medium">{meal.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{MEAL_CATEGORIES[meal.mealType as keyof typeof MEAL_CATEGORIES].icon}</span>
                          <span className="capitalize">{meal.mealType}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(meal.dateAdded)}</TableCell>
                      <TableCell>{meal.calories} kcal</TableCell>
                      <TableCell>
                        {meal.nutrients.find(n => n.name === "Protein")?.amount || 0}g
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleDeleteMeal(meal.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
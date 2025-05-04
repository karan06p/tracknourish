import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface NutritionalSummaryProps{
    totalsMeals: number;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number
}

export const NutritionalSummary = ({totalsMeals, totalCalories, totalProtein, totalCarbs}: NutritionalSummaryProps) => {
  return (
    <div>
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
                <p className="text-2xl font-bold">{totalsMeals}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600 mb-1">Total Calories</h3>
                <p className="text-2xl font-bold">{totalCalories} kcal</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600 mb-1">Total Protein</h3>
                <p className="text-2xl font-bold">{totalProtein} g</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600 mb-1">Total Carbs</h3>
                <p className="text-2xl font-bold">{totalCarbs} g</p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

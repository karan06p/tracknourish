import { eachMeal } from '@/types/Meal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ForkKnife } from 'lucide-react'

interface RecentMealSectionProps{
    mostRecentMeals: [eachMeal]
}

export default function RecentMealSection(props: RecentMealSectionProps) {
  return (
    <Card className='mb-12'>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Meals</CardTitle>
                  <CardDescription>
                    Your most recently logged meals
                  </CardDescription>
                </div>
                <Link href="/meals">
                  <Button variant="outline" size="sm" className="hover:cursor-pointer">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {props.mostRecentMeals?.map((item: eachMeal, idx: number) => (
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
                <div className="flex justify-center items-center">
                  <Link href={"/meals"}>
                  <Button variant="blue" className="hover:cursor-pointer w-36 sm:hidden">
                    <ForkKnife />
                    Track Meal
                  </Button>
                  </Link>
                </div>
            </CardContent>
          </Card>
  )
}

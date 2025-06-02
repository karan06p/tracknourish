"use client"

import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Cell, Pie, PieChart } from 'recharts'
import { Button } from '@/components/ui/button'
import { Id, Nutrient } from '@/types/Meal'


interface MealCardProps{
    id: Id;
    mealTypeColor: string;
    mealTypeIcon: string;
    mealName: string;
    mealTypeLabel: string;
    mealCalories: string;
    description?: string;
    tags: string[] | undefined;
    nutrients: Nutrient[];
    day: string;
    onDelete: (id: Id) => void;
};

const NUTRIENT_COLORS = {
    protein: "#4ade80",
    carbs: "#3b82f6",
    fat: "#f97316",
    others: "#8b5cf6",
  };

const RecentMealCard = ({...props}: MealCardProps) => {

    const getNutrientChartData = (nutrients: Nutrient[]) => {
      return nutrients.map((nutrient) => ({
          name: nutrient.name,
          value: nutrient.amount,
        }));
    };

  return (
    <Card key={String(props.id)} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className={`py-4 rounded-xl  ${props.mealTypeColor}`}>
                    <div className="flex justify-between items-center gap-2">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span>{props.mealTypeIcon}</span>
                          {props.mealName}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          <span className="capitalize">{props.mealTypeLabel}</span> • {props.mealCalories} kcal • 
                          <p>{props.day}</p>
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:cursor-pointer h-8 text-xs bg-white/70 hover:bg-white"
                        onClick={() => props.onDelete(props.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {props.description && <p className="text-sm text-gray-600 mb-4">{props.description}</p>}
                    
                    {props.tags && props.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {props.tags.map((tag, index) => (
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
                          {props.nutrients.map((nutrient, index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span>{nutrient.name}</span>
                              <span className="font-medium">{nutrient.amount}{nutrient.unit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <ChartContainer
                          className=""
                          config={{
                            protein: { color: NUTRIENT_COLORS.protein },
                            carbs: { color: NUTRIENT_COLORS.carbs },
                            fat: { color: NUTRIENT_COLORS.fat },
                            fiber: { color: NUTRIENT_COLORS.others },
                          }}
                        >
                            <PieChart>
                              <Pie
                                data={getNutrientChartData(props.nutrients)}
                                cx="50%"
                                cy="50%"
                                outerRadius="70%"
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={(entry) => `${entry.name}`}
                              >
                                {getNutrientChartData(props.nutrients).map((entry, index) => (
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
                        </ChartContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
  )
}

export default RecentMealCard
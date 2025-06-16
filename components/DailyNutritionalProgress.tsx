import React from 'react'
import { Card, CardHeader, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import ComingSoonInfo from './ComingSoonInfo'

export default function DailyNutritionalProgress() {
  return (
    <Card className='hover:cursor-not-allowed'>
            <CardHeader className="pb-3 flex justify-between items-center">
              <h2 className="text-lg font-medium">Today&#39;s Nutrition Goals</h2>
              <ComingSoonInfo/>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm text-muted-foreground">
                      1,200 / 2,000 kcal
                    </span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Protein</span>
                      <span className="text-sm text-muted-foreground">
                        45 / 75g
                      </span>
                    </div>
                    <Progress value={60} className="h-2 bg-blue-100" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Carbs</span>
                      <span className="text-sm text-muted-foreground">
                        120 / 250g
                      </span>
                    </div>
                    <Progress value={48} className="h-2 bg-amber-100" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Fat</span>
                      <span className="text-sm text-muted-foreground">
                        30 / 55g
                      </span>
                    </div>
                    <Progress value={54} className="h-2 bg-green-100" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
  )
}

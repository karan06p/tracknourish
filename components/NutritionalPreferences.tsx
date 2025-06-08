import React from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Edit } from 'lucide-react'
import ComingSoonInfo from './ComingSoonInfo'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Separator } from './ui/separator'

export default function NutritionalPreferences() {
  return (
    <Card className="lg:col-span-3 hover:cursor-not-allowed">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Nutrition Preferences</h2>
                  <div className="flex gap-3 items-center justify-between">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                <ComingSoonInfo/>
                  </div>
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
  )
}

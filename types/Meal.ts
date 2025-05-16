export interface Id {
    $oid: string
}

export interface eachMeal{
    mealName: string
    mealType: string
    description: string
    calories: string
    protein: string
    carbohydrates: string
    fiber: string
    fat: string
    tags: string[]
    _id: Id
}

export interface Nutrient {
    name: string;
    amount: number;
    unit: string;
    percentOfDailyNeeds?: number;
}


export interface Meal {
    id: string;
    name: string;
    description?: string;
    calories: number;
    mealType: string;
    dateAdded: Date;
    nutrients: Nutrient[];
    tags?: string[];
}

export interface NutrientItem {
    amount: string;
    indented: boolean;
    title: string;
    percentOfDailyNeeds: number;
}

export interface SearchResults {
    id: number;
    title: string;
    image: string;
}


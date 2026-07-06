export type MealCategory =
  | "protein"
  | "fastFood"
  | "healthy"
  | "snack"
  | "drink";

export const categoryToIcon: Record<MealCategory, string> = {
  protein: "dumbbell",
  fastFood: "food",
  healthy: "leaf",
  snack: "cookie",
  drink: "cup",
};

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealAnalysis {
  foods: FoodItem[];
}

export interface Meal {
  id: string;
  mealName: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  category: MealCategory;
  createdAt: string;
}

export interface MealTotals {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

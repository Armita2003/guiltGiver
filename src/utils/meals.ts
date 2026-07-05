import { Meal } from "@/storage/meals";

export type Totals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function computeTotals(meals: Meal[]): Totals {
  return meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + (meal.protein ?? 0),
      carbs: acc.carbs + (meal.carbs ?? 0),
      fat: acc.fat + (meal.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export default computeTotals;

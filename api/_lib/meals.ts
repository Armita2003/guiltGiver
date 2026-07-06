import { redisGet, redisSet } from "./redis";

export type StoredMeal = {
  id: string;
  mealName: string;
  foods: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  category: string;
  createdAt: string;
};

function mealsKey(email: string) {
  return `meals:${email}`;
}

export async function getMeals(email: string): Promise<StoredMeal[]> {
  const raw = await redisGet(mealsKey(email));
  if (!raw) return [];
  return JSON.parse(raw) as StoredMeal[];
}

export async function saveMeals(email: string, meals: StoredMeal[]): Promise<void> {
  await redisSet(mealsKey(email), JSON.stringify(meals));
}

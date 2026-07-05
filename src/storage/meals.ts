import AsyncStorage from "@react-native-async-storage/async-storage";

const MEALS_KEY = "meals";
export type MealCategory =
  "protein" | "fastFood" | "healthy" | "snack" | "drink";

export const categoryToIcon: Record<MealCategory, string> = {
  protein: "dumbbell",
  fastFood: "food",
  healthy: "leaf",
  snack: "cookie",
  drink: "cup",
};

export type Meal = {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  selectedCategory: MealCategory;
  createdAt: string;
};

export const getMeals = async (): Promise<Meal[]> => {
  const data = await AsyncStorage.getItem(MEALS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addMeal = async (
  meal: Omit<Meal, "id" | "createdAt">
): Promise<Meal> => {
  const meals = await getMeals();
  const newMeal: Meal = {
    ...meal,
    id: Date.now().toString(),
    createdAt: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  await AsyncStorage.setItem(MEALS_KEY, JSON.stringify([newMeal, ...meals]));
  return newMeal;
};

export const clearMeals = async () => {
  await AsyncStorage.removeItem(MEALS_KEY);
};

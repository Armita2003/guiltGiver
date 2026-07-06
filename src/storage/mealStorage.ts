import { FoodItem, Meal, MealCategory } from "@/types/nutrition";
import { calculateMealTotals } from "@/utils/nutrition";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addMealOnServer,
  clearMealsOnServer,
  deleteMealOnServer,
  fetchMealsFromServer,
  isApiConfigured,
} from "@/services/apiService";
import { getAuthToken, getUser, normalizeEmail } from "@/storage/userStorage";
import { emit } from "@/utils/events";

const ACTIVE_MEALS_KEY = "meals_v2";

function mealsKeyForUser(email: string) {
  return `meals_v2:${normalizeEmail(email)}`;
}

async function cacheMeals(meals: Meal[]): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_MEALS_KEY, JSON.stringify(meals));
  emit("meals:updated", meals);
}

async function getCachedMeals(): Promise<Meal[]> {
  const data = await AsyncStorage.getItem(ACTIVE_MEALS_KEY);
  if (!data) return [];

  const meals = JSON.parse(data) as Meal[];
  return meals.map((meal) => ({
    ...meal,
    category: meal.category ?? "fastFood",
  }));
}

async function getLocalMeals(email: string): Promise<Meal[]> {
  const data = await AsyncStorage.getItem(mealsKeyForUser(email));
  if (!data) return [];

  const meals = JSON.parse(data) as Meal[];
  return meals.map((meal) => ({
    ...meal,
    category: meal.category ?? "fastFood",
  }));
}

async function saveLocalMeals(email: string, meals: Meal[]): Promise<void> {
  await AsyncStorage.setItem(mealsKeyForUser(email), JSON.stringify(meals));
  await cacheMeals(meals);
}

export async function loadMealsForUser(email: string): Promise<Meal[]> {
  const meals = await getLocalMeals(email);
  await cacheMeals(meals);
  return meals;
}

export async function syncMealsFromServer(): Promise<Meal[]> {
  const user = await getUser();
  const token = await getAuthToken();
  if (!user || !token || !isApiConfigured()) {
    return user ? loadMealsForUser(user.email) : [];
  }

  const meals = await fetchMealsFromServer();
  await saveLocalMeals(user.email, meals);
  return meals;
}

export const getMeals = async (): Promise<Meal[]> => {
  const user = await getUser();
  if (!user) return [];

  if (isApiConfigured() && (await getAuthToken())) {
    try {
      return await syncMealsFromServer();
    } catch {
      return getCachedMeals();
    }
  }

  return getCachedMeals();
};

export const addMeal = async (
  mealName: string,
  foods: FoodItem[],
  category: MealCategory
): Promise<Meal> => {
  const user = await getUser();
  if (!user) {
    throw new Error("Sign in to save meals.");
  }

  const totals = calculateMealTotals(foods);
  const newMeal: Meal = {
    id: Date.now().toString(),
    mealName,
    foods,
    ...totals,
    category,
    createdAt: new Date().toISOString(),
  };

  if (isApiConfigured() && (await getAuthToken())) {
    const meals = await addMealOnServer(newMeal);
    await saveLocalMeals(user.email, meals);
    return newMeal;
  }

  const meals = await getLocalMeals(user.email);
  const updated = [newMeal, ...meals];
  await saveLocalMeals(user.email, updated);
  return newMeal;
};

export const deleteMeal = async (id: string): Promise<void> => {
  const user = await getUser();
  if (!user) {
    throw new Error("Sign in to manage meals.");
  }

  if (isApiConfigured() && (await getAuthToken())) {
    const meals = await deleteMealOnServer(id);
    await saveLocalMeals(user.email, meals);
    return;
  }

  const meals = await getLocalMeals(user.email);
  const updated = meals.filter((meal) => meal.id !== id);
  await saveLocalMeals(user.email, updated);
};

export const clearAllMeals = async (): Promise<void> => {
  const user = await getUser();
  if (!user) {
    throw new Error("Sign in to manage meals.");
  }

  if (isApiConfigured() && (await getAuthToken())) {
    const meals = await clearMealsOnServer();
    await saveLocalMeals(user.email, meals);
    return;
  }

  await saveLocalMeals(user.email, []);
};

export const clearLocalMealsForUser = async (email: string): Promise<void> => {
  await AsyncStorage.removeItem(mealsKeyForUser(email));
  await AsyncStorage.removeItem(ACTIVE_MEALS_KEY);
};

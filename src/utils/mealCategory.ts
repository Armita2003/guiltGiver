import { FoodItem, MealCategory } from "@/types/nutrition";
import { calculateMealTotals } from "@/utils/nutrition";

const CATEGORY_KEYWORDS: Record<MealCategory, string[]> = {
  protein: [
    "steak",
    "chicken",
    "egg",
    "bacon",
    "protein",
    "fish",
    "salmon",
    "tuna",
    "turkey",
    "beef",
    "pork",
    "shrimp",
    "tofu",
    "whey",
    "ham",
    "sausage",
    "lamb",
    "duck",
  ],
  healthy: [
    "salad",
    "vegetable",
    "veggie",
    "grilled",
    "air fried",
    "air-fried",
    "fruit",
    "banana",
    "apple",
    "oatmeal",
    "quinoa",
    "broccoli",
    "spinach",
    "avocado",
    "yogurt",
    "smoothie bowl",
    "brown rice",
  ],
  snack: [
    "cookie",
    "chip",
    "chips",
    "candy",
    "chocolate",
    "popcorn",
    "cracker",
    "snack",
    "granola bar",
    "nuts",
    "ice cream",
  ],
  drink: [
    "coffee",
    "soda",
    "juice",
    "tea",
    "latte",
    "beer",
    "wine",
    "cola",
    "water",
    "milkshake",
    "smoothie",
    "drink",
  ],
  fastFood: [
    "pizza",
    "burger",
    "fries",
    "fried",
    "donut",
    "hot dog",
    "taco",
    "nachos",
    "fast food",
    "takeout",
    "nuggets",
    "wings",
  ],
};

function scoreCategory(text: string): Record<MealCategory, number> {
  const scores: Record<MealCategory, number> = {
    protein: 0,
    fastFood: 0,
    healthy: 0,
    snack: 0,
    drink: 0,
  };

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [
    MealCategory,
    string[],
  ][]) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        scores[category] += 1;
      }
    }
  }

  return scores;
}

export function inferMealCategory(
  mealName: string,
  foods: FoodItem[],
  prompt?: string
): MealCategory {
  const text = `${prompt ?? ""} ${mealName} ${foods.map((f) => f.name).join(" ")}`
    .toLowerCase()
    .trim();

  const scores = scoreCategory(text);
  const totals = calculateMealTotals(foods);

  if (totals.totalProtein >= 25 && totals.totalProtein >= totals.totalCarbs) {
    scores.protein += 2;
  }

  if (text.includes("fried") || text.includes("greasy") || text.includes("cheese")) {
    scores.fastFood += 1;
  }

  if (text.includes("grilled") || text.includes("steamed") || text.includes("baked")) {
    scores.healthy += 1;
  }

  const drinkOnly =
    foods.length === 1 &&
    CATEGORY_KEYWORDS.drink.some((keyword) => text.includes(keyword)) &&
    totals.totalCalories < 300;

  if (drinkOnly) {
    return "drink";
  }

  const ranked = (Object.entries(scores) as [MealCategory, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  if (ranked[0][1] === 0) {
    return "fastFood";
  }

  return ranked[0][0];
}

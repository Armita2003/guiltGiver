import { requestJsonCompletion } from "@/services/openRouterService";
import { getMacroGoals } from "@/storage/nutritionGoalsStorage";
import { Meal } from "@/types/nutrition";
import { DEFAULT_MACRO_GOALS, MacroGoals } from "@/types/nutritionGoals";
import { calculateDailyTotals } from "@/utils/nutrition";
import {
  formatDateSectionLabel,
  getDateKey,
  groupMealsByDate,
  mealsDataHash,
} from "@/utils/mealDates";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type SystemStatusFeedback = {
  statusLabel: string;
  title: string;
  subtitle: string;
};

export type LogPageFeedback = {
  dayLabels: Record<string, string>;
  mealNotes: Record<string, string>;
};

const SYSTEM_CACHE_PREFIX = "guilt:system:";
const LOG_CACHE_PREFIX = "guilt:log:";

const systemMemoryCache = new Map<string, SystemStatusFeedback>();
const logMemoryCache = new Map<string, LogPageFeedback>();

const EMPTY_SYSTEM: SystemStatusFeedback = {
  statusLabel: "IDLE",
  title: "The machine is hungry.",
  subtitle: "Log something. Anything. We're judging either way.",
};

const FALLBACK_DAY_LABELS = [
  "PATHETIC DISPLAY",
  "RE-EVALUATE YOUR LIFE",
  "DISCIPLINE NOT FOUND",
  "A STUDY IN EXCESS",
  "SHAME ARCHIVE",
];

const FALLBACK_MEAL_NOTES = [
  "LUNCH DISASTER",
  "WEAKNESS FOUND",
  "LACK OF FLAVOR",
  "CALORIE CRIME",
  "REGRET IN PROGRESS",
  "MIDNIGHT MISTAKE",
  "PORTION DENIAL",
];

function pickFallback<T>(items: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % items.length;
  }
  return items[hash];
}

function buildMealSummary(meals: Meal[]): string {
  if (meals.length === 0) return "No meals logged.";

  const totals = calculateDailyTotals(meals);
  const recent = meals.slice(0, 8).map((m) => ({
    name: m.mealName,
    calories: m.totalCalories,
    protein: m.totalProtein,
    carbs: m.totalCarbs,
    fat: m.totalFat,
    category: m.category,
  }));

  return JSON.stringify({ totals, recent, mealCount: meals.length });
}

const GUILT_VOICE = `You are the Guilt Giver — a dark-humored, mean, passive-aggressive nutrition app.
Tone: insulting, sarcastic, blunt, all-caps energy. Never encouraging. Never wholesome.
Keep labels short (2-5 words). No emojis. No markdown. Return ONLY valid JSON.`;

export async function getSystemStatusFeedback(
  meals: Meal[]
): Promise<SystemStatusFeedback> {
  if (meals.length === 0) return EMPTY_SYSTEM;

  const hash = mealsDataHash(meals);
  const cacheKey = `${SYSTEM_CACHE_PREFIX}${hash}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached) as SystemStatusFeedback;

  try {
    const goals = await getMacroGoals();
    const prompt = `${GUILT_VOICE}

Based on this user's meal data, write a landing-page system status.
Their daily targets: ${goals.calories} kcal, ${goals.protein}g protein, ${goals.carbs}g carbs, ${goals.fat}g fat.

Data: ${buildMealSummary(meals)}

Return JSON:
{
  "statusLabel": "2-4 word ALL CAPS status like UNIMPRESSED or CRITICAL FAILURE",
  "title": "short punchy headline, sentence case ok",
  "subtitle": "one mean sentence roasting their eating habits based on the data"
}`;

    const result = await requestJsonCompletion<SystemStatusFeedback>(prompt);
    const feedback: SystemStatusFeedback = {
      statusLabel: String(result.statusLabel ?? "UNIMPRESSED").toUpperCase(),
      title: String(result.title ?? "Feed the machine."),
      subtitle: String(
        result.subtitle ??
          "Your data says you already know what you did."
      ),
    };

    await AsyncStorage.setItem(cacheKey, JSON.stringify(feedback));
    return feedback;
  } catch {
    const totals = calculateDailyTotals(meals);
    const goals = await getMacroGoals();
    const overTarget = totals.calories > goals.calories;
    return {
      statusLabel: overTarget ? "CRITICAL" : "UNIMPRESSED",
      title: "Feed the machine.",
      subtitle: overTarget
        ? `${totals.calories} calories and counting. Impressive, in the worst way.`
        : "Did you really need that second snack? Your data says otherwise.",
    };
  }
}

export async function getLogPageFeedback(
  meals: Meal[]
): Promise<LogPageFeedback> {
  if (meals.length === 0) {
    return { dayLabels: {}, mealNotes: {} };
  }

  const hash = mealsDataHash(meals);
  const cacheKey = `${LOG_CACHE_PREFIX}${hash}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached) as LogPageFeedback;

  const groups = groupMealsByDate(meals);
  const dayKeys = [...groups.keys()];
  const mealPayload = meals.map((m) => ({
    id: m.id,
    name: m.mealName,
    calories: m.totalCalories,
    time: m.createdAt,
    category: m.category,
    date: getDateKey(m.createdAt),
  }));

  try {
    const prompt = `${GUILT_VOICE}

Generate mean labels for a meal failure log.

Meals: ${JSON.stringify(mealPayload)}
Date keys needing day labels: ${JSON.stringify(dayKeys)}

For each date key, write a 2-4 word ALL CAPS day insult (e.g. "PATHETIC DISPLAY").
For each meal id, write a 2-3 word ALL CAPS note for beside the time (e.g. "LUNCH DISASTER").

Return JSON:
{
  "dayLabels": { "YYYY-MM-DD": "INSULT" },
  "mealNotes": { "meal-id": "NOTE" }
}`;

    const result = await requestJsonCompletion<LogPageFeedback>(prompt);
    const feedback: LogPageFeedback = {
      dayLabels: result.dayLabels ?? {},
      mealNotes: result.mealNotes ?? {},
    };

    for (const key of dayKeys) {
      if (!feedback.dayLabels[key]) {
        feedback.dayLabels[key] = pickFallback(FALLBACK_DAY_LABELS, key);
      }
    }
    for (const meal of meals) {
      if (!feedback.mealNotes[meal.id]) {
        feedback.mealNotes[meal.id] = pickFallback(
          FALLBACK_MEAL_NOTES,
          meal.id
        );
      }
    }

    await AsyncStorage.setItem(cacheKey, JSON.stringify(feedback));
    return feedback;
  } catch {
    const fallback: LogPageFeedback = { dayLabels: {}, mealNotes: {} };
    for (const key of dayKeys) {
      fallback.dayLabels[key] = pickFallback(FALLBACK_DAY_LABELS, key);
    }
    for (const meal of meals) {
      fallback.mealNotes[meal.id] = pickFallback(FALLBACK_MEAL_NOTES, meal.id);
    }
    return fallback;
  }
}

export function getDayLabel(
  feedback: LogPageFeedback,
  dateKey: string
): string {
  return (
    feedback.dayLabels[dateKey] ??
    pickFallback(FALLBACK_DAY_LABELS, dateKey)
  ).toUpperCase();
}

export function getMealNote(feedback: LogPageFeedback, meal: Meal): string {
  return (
    feedback.mealNotes[meal.id] ?? pickFallback(FALLBACK_MEAL_NOTES, meal.id)
  ).toUpperCase();
}

export function formatSectionHeader(dateKey: string, insult: string): string {
  return `${formatDateSectionLabel(dateKey)} — ${insult}`;
}

import { Meal } from "@/types/nutrition";

const LEGACY_TIME_RE = /^\d{1,2}:\d{2}\s*(AM|PM)$/i;

export function parseMealDate(createdAt: string): Date {
  const iso = new Date(createdAt);
  if (!isNaN(iso.getTime()) && createdAt.includes("T")) {
    return iso;
  }

  if (LEGACY_TIME_RE.test(createdAt.trim())) {
    const today = new Date();
    const match = createdAt.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      today.setHours(hours, minutes, 0, 0);
      return today;
    }
  }

  return new Date();
}

export function getDateKey(createdAt: string): string {
  const d = parseMealDate(createdAt);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatMealTime(createdAt: string): string {
  if (LEGACY_TIME_RE.test(createdAt.trim())) {
    return createdAt.trim().toUpperCase();
  }
  return parseMealDate(createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateSectionLabel(dateKey: string): string {
  const today = new Date();
  const todayKey = getDateKey(today.toISOString());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDateKey(yesterday.toISOString());

  if (dateKey === todayKey) return "TODAY";
  if (dateKey === yesterdayKey) return "YESTERDAY";

  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

export function isLateNightMeal(createdAt: string): boolean {
  const hour = parseMealDate(createdAt).getHours();
  return hour >= 21 || hour < 5;
}

export function groupMealsByDate(meals: Meal[]): Map<string, Meal[]> {
  const groups = new Map<string, Meal[]>();

  for (const meal of meals) {
    const key = getDateKey(meal.createdAt);
    const existing = groups.get(key) ?? [];
    existing.push(meal);
    groups.set(key, existing);
  }

  return new Map(
    [...groups.entries()].sort(([a], [b]) => b.localeCompare(a))
  );
}

export function mealsDataHash(meals: Meal[]): string {
  return meals
    .map(
      (m) =>
        `${m.id}:${m.totalCalories}:${m.totalProtein}:${m.totalCarbs}:${m.totalFat}`
    )
    .join("|");
}

import {
  DEFAULT_MACRO_GOALS,
  MacroGoals,
  NutritionGoalsSettings,
} from "@/types/nutritionGoals";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GOALS_KEY = "@guiltGiver/nutritionGoals";

export async function getNutritionGoalsSettings(): Promise<NutritionGoalsSettings> {
  const raw = await AsyncStorage.getItem(GOALS_KEY);
  if (!raw) {
    return { mode: "manual", goals: { ...DEFAULT_MACRO_GOALS } };
  }

  const parsed = JSON.parse(raw) as Partial<NutritionGoalsSettings>;
  return {
    mode: parsed.mode ?? "manual",
    goals: { ...DEFAULT_MACRO_GOALS, ...parsed.goals },
    bodyProfile: parsed.bodyProfile,
  };
}

export async function getMacroGoals(): Promise<MacroGoals> {
  const settings = await getNutritionGoalsSettings();
  return settings.goals;
}

export async function saveNutritionGoalsSettings(
  settings: NutritionGoalsSettings
): Promise<void> {
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(settings));
}

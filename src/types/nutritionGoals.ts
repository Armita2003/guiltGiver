export type MacroGoals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type GoalsMode = "manual" | "ai";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type WeightGoal = "lose" | "maintain" | "gain";

export type Sex = "male" | "female" | "other";

export type BodyProfile = {
  age: number;
  heightCm: number;
  weightKg: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  goal: WeightGoal;
  country?: string;
};

export type NutritionGoalsSettings = {
  mode: GoalsMode;
  goals: MacroGoals;
  bodyProfile?: BodyProfile;
};

export const DEFAULT_MACRO_GOALS: MacroGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
};

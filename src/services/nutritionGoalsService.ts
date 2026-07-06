import { requestJsonCompletion } from "@/services/openRouterService";
import { BodyProfile, MacroGoals } from "@/types/nutritionGoals";

const ACTIVITY_LABELS: Record<BodyProfile["activityLevel"], string> = {
  sedentary: "little or no exercise",
  light: "light exercise 1-3 days/week",
  moderate: "moderate exercise 3-5 days/week",
  active: "hard exercise 6-7 days/week",
  very_active: "very hard exercise or physical job",
};

export async function estimateMacroGoals(
  profile: BodyProfile
): Promise<MacroGoals> {
  const prompt = `You are a nutrition assistant.

Estimate daily macronutrient targets for this person using established science (Mifflin-St Jeor BMR, standard activity multipliers, and goal adjustment).

Profile:
- Age: ${profile.age} years
- Height: ${profile.heightCm} cm
- Weight: ${profile.weightKg} kg
- Sex: ${profile.sex}
- Activity: ${ACTIVITY_LABELS[profile.activityLevel]}
- Goal: ${profile.goal} weight
${profile.country ? `- Country: ${profile.country}` : ""}

Return ONLY valid JSON. No markdown. No explanations.

Schema:
{
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0
}`;

  const result = await requestJsonCompletion<MacroGoals>(prompt);

  const goals: MacroGoals = {
    calories: Math.round(Number(result.calories) || 0),
    protein: Math.round(Number(result.protein) || 0),
    carbs: Math.round(Number(result.carbs) || 0),
    fat: Math.round(Number(result.fat) || 0),
  };

  if (
    goals.calories <= 0 ||
    goals.protein <= 0 ||
    goals.carbs <= 0 ||
    goals.fat <= 0
  ) {
    throw new Error("AI returned invalid macro targets. Try again.");
  }

  return goals;
}

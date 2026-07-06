import { getEmailFromToken } from "./_lib/auth";
import { getMeals, saveMeals, StoredMeal } from "./_lib/meals";
import {
  getBearerToken,
  handleOptions,
  setCors,
  VercelRequest,
  VercelResponse,
} from "./_lib/http";

async function requireEmail(req: VercelRequest, res: VercelResponse) {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  const email = await getEmailFromToken(token);
  if (!email) {
    res.status(401).json({ error: "Session expired. Please sign in again." });
    return null;
  }

  return email;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  setCors(res);

  try {
    const email = await requireEmail(req, res);
    if (!email) return;

    if (req.method === "GET") {
      const meals = await getMeals(email);
      return res.status(200).json({ meals });
    }

    if (req.method === "POST") {
      const meal = req.body?.meal as StoredMeal | undefined;
      if (!meal?.mealName) {
        return res.status(400).json({ error: "Meal data is required." });
      }

      const meals = await getMeals(email);
      const newMeal: StoredMeal = {
        ...meal,
        id: meal.id || Date.now().toString(),
        createdAt: meal.createdAt || new Date().toISOString(),
      };
      const updated = [newMeal, ...meals];
      await saveMeals(email, updated);
      return res.status(200).json({ meal: newMeal, meals: updated });
    }

    if (req.method === "DELETE") {
      const id = req.query?.id;
      const clearAll = req.query?.all === "true";

      if (clearAll) {
        await saveMeals(email, []);
        return res.status(200).json({ meals: [] });
      }

      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "Meal id is required." });
      }

      const meals = await getMeals(email);
      const updated = meals.filter((meal) => meal.id !== id);
      await saveMeals(email, updated);
      return res.status(200).json({ meals: updated });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("meals error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Request failed.",
    });
  }
}

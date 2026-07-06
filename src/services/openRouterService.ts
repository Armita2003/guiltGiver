import { MealAnalysis } from "@/types/nutrition";
import * as FileSystem from "expo-file-system/legacy";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Free vision models rotate on OpenRouter — try in order until one works.
const FREE_VISION_MODELS = [
  "qwen/qwen-2.5-vl-7b-instruct:free",
  "qwen/qwen2.5-vl-32b-instruct:free",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "google/gemma-3-27b-it:free",
  "openrouter/free",
];

const FREE_TEXT_MODELS = [
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen-2-7b-instruct:free",
  "openrouter/free",
];

const NUTRITION_PROMPT = `You are a nutrition assistant.

Estimate the nutritional values of the provided meal.

Return ONLY valid JSON.
Never return markdown.
Never return explanations.

Schema:
{
  "foods": [
    {
      "name": "",
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0
    }
  ]
}`;

type MessageContent =
  | string
  | Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    >;

function getApiKey(): string {
  const key = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("EXPO_PUBLIC_OPENROUTER_API_KEY is not configured.");
  }
  return key;
}

function parseMealAnalysis(raw: string): MealAnalysis {
  const parsed = parseJsonResponse<MealAnalysis>(raw);

  if (!Array.isArray(parsed.foods)) {
    throw new Error("Invalid response: missing foods array.");
  }

  return {
    foods: parsed.foods.map((food) => ({
      name: String(food.name ?? ""),
      calories: Number(food.calories) || 0,
      protein: Number(food.protein) || 0,
      carbs: Number(food.carbs) || 0,
      fat: Number(food.fat) || 0,
    })),
  };
}

function parseJsonResponse<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
  return JSON.parse(cleaned) as T;
}

export async function requestTextCompletion(prompt: string): Promise<string> {
  let lastError = "All free models are currently unavailable.";

  for (const model of FREE_TEXT_MODELS) {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "HTTP-Referer": "https://guiltgiver.app",
        "X-Title": "guiltGiver",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      lastError =
        data?.error?.message ?? `OpenRouter request failed (${response.status})`;
      const retryable =
        response.status === 404 ||
        response.status === 429 ||
        response.status === 503;
      if (retryable) continue;
      throw new Error(lastError);
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text || typeof text !== "string") {
      lastError = "Empty response from OpenRouter.";
      continue;
    }

    return text;
  }

  throw new Error(lastError);
}

export async function requestJsonCompletion<T>(prompt: string): Promise<T> {
  const text = await requestTextCompletion(prompt);
  return parseJsonResponse<T>(text);
}

async function requestAnalysis(content: MessageContent): Promise<MealAnalysis> {
  let lastError = "All free models are currently unavailable.";

  for (const model of FREE_VISION_MODELS) {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "HTTP-Referer": "https://guiltgiver.app",
        "X-Title": "guiltGiver",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      lastError =
        data?.error?.message ?? `OpenRouter request failed (${response.status})`;
      const retryable =
        response.status === 404 ||
        response.status === 429 ||
        response.status === 503;
      if (retryable) continue;
      throw new Error(lastError);
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text || typeof text !== "string") {
      lastError = "Empty response from OpenRouter.";
      continue;
    }

    return parseMealAnalysis(text);
  }

  throw new Error(lastError);
}

export async function analyzeMealText(meal: string): Promise<MealAnalysis> {
  if (!meal.trim()) {
    throw new Error("Meal description cannot be empty.");
  }

  return requestAnalysis(`${NUTRITION_PROMPT}\n\nMeal: ${meal.trim()}`);
}

function getMimeType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic")) return "image/heic";
  return "image/jpeg";
}

export async function analyzeMealImage(imageUri: string): Promise<MealAnalysis> {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const mimeType = getMimeType(imageUri);

  return requestAnalysis([
    { type: "text", text: NUTRITION_PROMPT },
    {
      type: "image_url",
      image_url: { url: `data:${mimeType};base64,${base64}` },
    },
  ]);
}

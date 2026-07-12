// import { MealAnalysis } from "@/types/nutrition";
// import * as FileSystem from "expo-file-system/legacy";

// const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// // Free vision models rotate on OpenRouter — try in order until one works.
// // const FREE_VISION_MODELS = [
// //   "qwen/qwen-2.5-vl-7b-instruct:free",
// //   "qwen/qwen2.5-vl-32b-instruct:free",
// //   "meta-llama/llama-3.2-11b-vision-instruct:free",
// //   "google/gemma-3-27b-it:free",
// //   "openrouter/free",
// // ];
// const FREE_VISION_MODELS = [
//   "openrouter/free",
//   "qwen/qwen-2.5-vl-7b-instruct:free",
//   "qwen/qwen2.5-vl-32b-instruct:free",
//   "meta-llama/llama-3.2-11b-vision-instruct:free",
//   "google/gemma-3-27b-it:free",
// ];

// // const FREE_TEXT_MODELS = [
// //   "google/gemma-3-27b-it:free",
// //   "meta-llama/llama-3.2-3b-instruct:free",
// //   "qwen/qwen-2-7b-instruct:free",
// //   "openrouter/free",
// // ];
// const FREE_TEXT_MODELS = [
//   "openrouter/free",
//   "google/gemma-3-27b-it:free",
//   "meta-llama/llama-3.2-3b-instruct:free",
//   "qwen/qwen-2-7b-instruct:free",
// ];

// const NUTRITION_PROMPT = `You are a nutrition assistant.

// Estimate the nutritional values of the provided meal.

// Return ONLY valid JSON.
// Never return markdown.
// Never return explanations.

// Schema:
// {
//   "foods": [
//     {
//       "name": "",
//       "calories": 0,
//       "protein": 0,
//       "carbs": 0,
//       "fat": 0
//     }
//   ]
// }`;

// type MessageContent =
//   | string
//   | Array<
//       | { type: "text"; text: string }
//       | { type: "image_url"; image_url: { url: string } }
//     >;

// function getApiKey(): string {
//   const key = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
//   // console.log("OPENROUTER_KEY_PRESENT:", !!key);
//   if (!key) {
//     throw new Error("EXPO_PUBLIC_OPENROUTER_API_KEY is not configured.");
//   }
//   return key;
// }

// function parseMealAnalysis(raw: string): MealAnalysis {
//   const parsed = parseJsonResponse<MealAnalysis>(raw);

//   if (!Array.isArray(parsed.foods)) {
//     throw new Error("Invalid response: missing foods array.");
//   }

//   return {
//     foods: parsed.foods.map((food) => ({
//       name: String(food.name ?? ""),
//       calories: Number(food.calories) || 0,
//       protein: Number(food.protein) || 0,
//       carbs: Number(food.carbs) || 0,
//       fat: Number(food.fat) || 0,
//     })),
//   };
// }

// function parseJsonResponse<T>(raw: string): T {
//   const cleaned = raw
//     .trim()
//     .replace(/^```json\s*/i, "")
//     .replace(/^```\s*/i, "")
//     .replace(/\s*```$/i, "");
//   return JSON.parse(cleaned) as T;
// }

// export async function requestTextCompletion(prompt: string): Promise<string> {
//   let lastError = "All free models are currently unavailable.";

//   for (const model of FREE_TEXT_MODELS) {
//     const response = await fetch(OPENROUTER_URL, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${getApiKey()}`,
//         "HTTP-Referer": "https://guiltgiver.app",
//         "X-Title": "guiltGiver",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model,
//         messages: [{ role: "user", content: prompt }],
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       lastError =
//         data?.error?.message ??
//         `OpenRouter request failed (${response.status})`;
//       const retryable =
//         response.status === 403 ||
//         response.status === 404 ||
//         response.status === 429 ||
//         response.status === 503;

//       if (retryable) {
//         continue;
//       }
//       throw new Error(lastError);
//     }

//     const text = data.choices?.[0]?.message?.content;
//     if (!text || typeof text !== "string") {
//       lastError = "Empty response from OpenRouter.";
//       continue;
//     }
//     const textOrJson = await response.text();
//     console.log("OpenRouter status:", response.status, "body:", textOrJson);
//     return text;
//   }

//   throw new Error(lastError);
// }

// export async function requestJsonCompletion<T>(prompt: string): Promise<T> {
//   const text = await requestTextCompletion(prompt);
//   return parseJsonResponse<T>(text);
// }

// async function requestAnalysis(content: MessageContent): Promise<MealAnalysis> {
//   let lastError = "All free models are currently unavailable.";

//   for (const model of FREE_VISION_MODELS) {
//     const response = await fetch(OPENROUTER_URL, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${getApiKey()}`,
//         "HTTP-Referer": "https://guiltgiver.app",
//         "X-Title": "guiltGiver",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model,
//         messages: [{ role: "user", content }],
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       lastError =
//         data?.error?.message ??
//         `OpenRouter request failed (${response.status})`;
//       const retryable =
//         response.status === 404 ||
//         response.status === 429 ||
//         response.status === 503;
//       if (retryable) continue;
//       throw new Error(lastError);
//     }

//     const text = data.choices?.[0]?.message?.content;
//     if (!text || typeof text !== "string") {
//       lastError = "Empty response from OpenRouter.";
//       continue;
//     }

//     return parseMealAnalysis(text);
//   }

//   throw new Error(lastError);
// }

// export async function analyzeMealText(meal: string): Promise<MealAnalysis> {
//   if (!meal.trim()) {
//     throw new Error("Meal description cannot be empty.");
//   }

//   return requestAnalysis(`${NUTRITION_PROMPT}\n\nMeal: ${meal.trim()}`);
// }

// function getMimeType(uri: string): string {
//   const lower = uri.toLowerCase();
//   if (lower.endsWith(".png")) return "image/png";
//   if (lower.endsWith(".webp")) return "image/webp";
//   if (lower.endsWith(".heic")) return "image/heic";
//   return "image/jpeg";
// }

// export async function analyzeMealImage(
//   imageUri: string
// ): Promise<MealAnalysis> {
//   const base64 = await FileSystem.readAsStringAsync(imageUri, {
//     encoding: FileSystem.EncodingType.Base64,
//   });

//   const mimeType = getMimeType(imageUri);

//   return requestAnalysis([
//     { type: "text", text: NUTRITION_PROMPT },
//     {
//       type: "image_url",
//       image_url: { url: `data:${mimeType};base64,${base64}` },
//     },
//   ]);
// }

import { MealAnalysis } from "@/types/nutrition";
import * as FileSystem from "expo-file-system/legacy";

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

type ProviderConfig = {
  name: string;
  url: string;
  headers: Record<string, string>;
  models: string[];
  kind: "openai-compatible" | "huggingface";
};

const OPENAI_MODELS = ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4o"];

const OPENROUTER_TEXT_MODELS = [
  "openrouter/free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen-2-7b-instruct:free",
];

const OPENROUTER_VISION_MODELS = [
  "openrouter/free",
  "qwen/qwen-2.5-vl-7b-instruct:free",
  "qwen/qwen2.5-vl-32b-instruct:free",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "google/gemma-3-27b-it:free",
];

function getProviderConfigs(isVision: boolean): ProviderConfig[] {
  const providers: ProviderConfig[] = [];
  const openAiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (openAiKey) {
    providers.push({
      name: "openai",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      models: [
        process.env.EXPO_PUBLIC_OPENAI_MODEL ?? OPENAI_MODELS[0],
        ...OPENAI_MODELS.filter(
          (model) =>
            model !== (process.env.EXPO_PUBLIC_OPENAI_MODEL ?? OPENAI_MODELS[0])
        ),
      ],
      kind: "openai-compatible",
    });
  }

  const openRouterKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
  if (openRouterKey) {
    providers.push({
      name: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "HTTP-Referer": "https://guiltgiver.app",
        "X-Title": "guiltGiver",
        "Content-Type": "application/json",
      },
      models: isVision ? OPENROUTER_VISION_MODELS : OPENROUTER_TEXT_MODELS,
      kind: "openai-compatible",
    });
  }

  const huggingFaceKey = process.env.EXPO_PUBLIC_HUGGINGFACE_API_KEY;
  if (huggingFaceKey && !isVision) {
    providers.push({
      name: "huggingface",
      url: "https://api-inference.huggingface.co/models/{model}",
      headers: {
        Authorization: `Bearer ${huggingFaceKey}`,
        "Content-Type": "application/json",
      },
      models: [
        process.env.EXPO_PUBLIC_HUGGINGFACE_MODEL ??
          "microsoft/Phi-3.5-mini-instruct",
      ],
      kind: "huggingface",
    });
  }

  return providers;
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

  const candidates = [cleaned];
  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch?.[1]) {
    candidates.push(jsonMatch[1]);
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      const compact = candidate.replace(/\n/g, " ").replace(/\s+/g, " ");
      const compactMatch = compact.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (compactMatch?.[1]) {
        try {
          return JSON.parse(compactMatch[1]) as T;
        } catch {
          // try next candidate
        }
      }
    }
  }

  throw new Error("Invalid JSON response.");
}

function extractMessageText(content: unknown): string | null {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const textParts = content.flatMap((item) => {
      if (item && typeof item === "object" && "text" in item) {
        const text = item.text;
        return typeof text === "string" ? [text] : [];
      }
      return [];
    });

    return textParts.join("\n") || null;
  }

  return null;
}

function extractProviderText(
  provider: ProviderConfig,
  data: any
): string | null {
  if (provider.kind === "huggingface") {
    if (typeof data?.generated_text === "string") {
      return data.generated_text;
    }

    if (Array.isArray(data)) {
      const first = data[0];
      if (first && typeof first.generated_text === "string") {
        return first.generated_text;
      }
    }

    return null;
  }

  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data?.choices?.[0]?.message?.content === "string") {
      return data.choices[0].message.content;
    }
    if (typeof data?.message?.content === "string") {
      return data.message.content;
    }
    if (typeof data?.content === "string") {
      return data.content;
    }
    if (Array.isArray(data?.choices)) {
      for (const choice of data.choices) {
        const nested = extractProviderText(provider, choice);
        if (nested) return nested;
      }
    }
    if (typeof data?.text === "string") {
      return data.text;
    }
  }

  return null;
}

async function requestCompletion(
  content: MessageContent,
  isJsonResponse = false,
  isVision = false
): Promise<string> {
  const providers = getProviderConfigs(isVision);
  if (providers.length === 0) {
    throw new Error(
      "No AI API key configured. Set EXPO_PUBLIC_OPENAI_API_KEY, EXPO_PUBLIC_OPENROUTER_API_KEY, or EXPO_PUBLIC_HUGGINGFACE_API_KEY."
    );
  }

  let lastError = "All AI models are currently unavailable.";

  for (const provider of providers) {
    for (const model of provider.models) {
      try {
        const requestUrl =
          provider.kind === "huggingface"
            ? provider.url.replace("{model}", encodeURIComponent(model))
            : provider.url;

        const requestBody =
          provider.kind === "huggingface"
            ? {
                inputs:
                  typeof content === "string"
                    ? content
                    : JSON.stringify(content),
                parameters: {
                  max_new_tokens: 300,
                  temperature: 0.2,
                },
              }
            : {
                model,
                messages: [{ role: "user", content }],
                ...(isJsonResponse && provider.name === "openai"
                  ? { response_format: { type: "json_object" } }
                  : {}),
              };

        const response = await fetch(requestUrl, {
          method: "POST",
          headers: provider.headers,
          body: JSON.stringify(requestBody),
        });

        const rawBody = await response.text();
        let data: any = rawBody;

        try {
          data = rawBody ? JSON.parse(rawBody) : {};
        } catch {
          data = rawBody;
        }

        if (!response.ok) {
          lastError =
            (typeof data === "object" &&
              data !== null &&
              data.error?.message) ||
            (typeof data === "object" &&
              data !== null &&
              data.detail?.[0]?.message) ||
            (typeof data === "string" ? data : undefined) ||
            `AI request failed (${response.status})`;
          const retryable =
            response.status === 403 ||
            response.status === 404 ||
            response.status === 429 ||
            response.status === 503;
          if (retryable) continue;
          throw new Error(lastError);
        }

        const text = extractProviderText(provider, data);
        if (!text) {
          lastError = "Empty response from AI provider.";
          continue;
        }

        return text;
      } catch (error) {
        lastError =
          error instanceof Error ? error.message : "AI request failed.";
      }
    }
  }

  throw new Error(lastError);
}

export async function requestTextCompletion(prompt: string): Promise<string> {
  return requestCompletion(prompt);
}

export async function requestJsonCompletion<T>(prompt: string): Promise<T> {
  const text = await requestCompletion(prompt, true);
  return parseJsonResponse<T>(text);
}

async function requestAnalysis(content: MessageContent): Promise<MealAnalysis> {
  const text = await requestCompletion(content, false, true);
  return parseMealAnalysis(text);
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

export async function analyzeMealImage(
  imageUri: string
): Promise<MealAnalysis> {
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

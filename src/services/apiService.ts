import { getAuthToken } from "@/storage/userStorage";
import { Meal } from "@/types/nutrition";
import { UserProfile } from "@/types/user";

export function isApiConfigured(): boolean {
  return !!process.env.EXPO_PUBLIC_API_URL?.trim();
}

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

type AuthResponse = {
  token: string;
  user: UserProfile;
  meals: Meal[];
};

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!isApiConfigured() || !API_URL) {
    throw new Error("API is not configured.");
  }

  const token = await getAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Request failed."
    );
  }

  return data as T;
}

export async function registerAccount(
  email: string,
  password: string,
  marketingConsent: boolean
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, marketingConsent }),
  });
}

export async function loginAccount(
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchMealsFromServer(): Promise<Meal[]> {
  const data = await apiFetch<{ meals: Meal[] }>("/api/meals", {
    method: "GET",
  });
  return data.meals;
}

export async function addMealOnServer(meal: Meal): Promise<Meal[]> {
  const data = await apiFetch<{ meals: Meal[] }>("/api/meals", {
    method: "POST",
    body: JSON.stringify({ meal }),
  });
  return data.meals;
}

export async function deleteMealOnServer(id: string): Promise<Meal[]> {
  const data = await apiFetch<{ meals: Meal[] }>(
    `/api/meals?id=${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
  return data.meals;
}

export async function clearMealsOnServer(): Promise<Meal[]> {
  const data = await apiFetch<{ meals: Meal[] }>("/api/meals?all=true", {
    method: "DELETE",
  });
  return data.meals;
}

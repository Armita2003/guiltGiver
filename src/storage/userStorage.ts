import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "@/types/user";

const USER_KEY = "@guiltGiver/user";
const TOKEN_KEY = "@guiltGiver/authToken";
const EMAIL_ACCOUNTS_KEY = "@guiltGiver/emailAccounts";

type EmailAccount = {
  email: string;
  passwordHash: string;
  marketingConsent: boolean;
};

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getUser(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveUser(user: UserProfile): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function saveAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
}

export function isAiUnlocked(user: UserProfile | null): boolean {
  return !!user?.email;
}

export async function registerLocalAccount(
  email: string,
  password: string,
  marketingConsent: boolean
): Promise<UserProfile> {
  const normalized = normalizeEmail(email);
  const raw = await AsyncStorage.getItem(EMAIL_ACCOUNTS_KEY);
  const accounts: EmailAccount[] = raw ? JSON.parse(raw) : [];

  if (accounts.some((a) => a.email === normalized)) {
    throw new Error("An account with this email already exists.");
  }

  accounts.push({
    email: normalized,
    passwordHash: simpleHash(password),
    marketingConsent,
  });
  await AsyncStorage.setItem(EMAIL_ACCOUNTS_KEY, JSON.stringify(accounts));

  return {
    email: normalized,
    marketingConsent,
    createdAt: new Date().toISOString(),
  };
}

export async function loginLocalAccount(
  email: string,
  password: string
): Promise<UserProfile> {
  const normalized = normalizeEmail(email);
  const raw = await AsyncStorage.getItem(EMAIL_ACCOUNTS_KEY);
  const accounts: EmailAccount[] = raw ? JSON.parse(raw) : [];
  const account = accounts.find((a) => a.email === normalized);

  if (!account || account.passwordHash !== simpleHash(password)) {
    throw new Error("Invalid email or password.");
  }

  return {
    email: account.email,
    marketingConsent: account.marketingConsent,
    createdAt: new Date().toISOString(),
  };
}

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { redisDel, redisExpire, redisGet, redisSet } from "./redis";

export type StoredUser = {
  email: string;
  passwordHash: string;
  marketingConsent: boolean;
  createdAt: string;
};

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function userKey(email: string) {
  return `user:${email}`;
}

function sessionKey(token: string) {
  return `session:${token}`;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashVerify = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(hash), Buffer.from(hashVerify));
}

export function createToken(): string {
  return createHash("sha256").update(randomBytes(32)).digest("hex");
}

export async function getUser(email: string): Promise<StoredUser | null> {
  const raw = await redisGet(userKey(email));
  return raw ? (JSON.parse(raw) as StoredUser) : null;
}

export async function saveUser(user: StoredUser): Promise<void> {
  await redisSet(userKey(user.email), JSON.stringify(user));
}

export async function createSession(email: string): Promise<string> {
  const token = createToken();
  const key = sessionKey(token);
  await redisSet(key, email);
  await redisExpire(key, SESSION_TTL_SECONDS);
  return token;
}

export async function getEmailFromToken(token: string): Promise<string | null> {
  return redisGet(sessionKey(token));
}

export async function deleteSession(token: string): Promise<void> {
  await redisDel(sessionKey(token));
}

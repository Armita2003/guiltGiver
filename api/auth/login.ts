import {
  createSession,
  getUser,
  normalizeEmail,
  verifyPassword,
} from "../_lib/auth";
import { getMeals } from "../_lib/meals";
import { handleOptions, setCors, VercelRequest, VercelResponse } from "../_lib/http";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  setCors(res);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body ?? {};
    const normalized = normalizeEmail(String(email ?? ""));

    if (!EMAIL_REGEX.test(normalized)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    const user = await getUser(normalized);
    if (!user || !verifyPassword(String(password), user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = await createSession(normalized);
    const meals = await getMeals(normalized);

    return res.status(200).json({
      token,
      user: {
        email: user.email,
        marketingConsent: user.marketingConsent,
        createdAt: user.createdAt,
      },
      meals,
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Login failed.",
    });
  }
}

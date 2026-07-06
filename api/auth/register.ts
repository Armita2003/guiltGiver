import {
  createSession,
  getUser,
  hashPassword,
  normalizeEmail,
  saveUser,
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
    const { email, password, marketingConsent } = req.body ?? {};
    const normalized = normalizeEmail(String(email ?? ""));

    if (!EMAIL_REGEX.test(normalized)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    if (!marketingConsent) {
      return res.status(400).json({ error: "Marketing consent is required." });
    }

    const existing = await getUser(normalized);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const user = {
      email: normalized,
      passwordHash: hashPassword(String(password)),
      marketingConsent: true,
      createdAt: new Date().toISOString(),
    };

    await saveUser(user);
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
    console.error("register error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Registration failed.",
    });
  }
}

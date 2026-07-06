import {
  loginAccount,
  registerAccount,
  isApiConfigured,
} from "@/services/apiService";
import {
  loadMealsForUser,
  syncMealsFromServer,
} from "@/storage/mealStorage";
import {
  clearSession,
  getUser,
  isAiUnlocked,
  loginLocalAccount,
  registerLocalAccount,
  saveAuthToken,
  saveUser,
} from "@/storage/userStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "@/types/user";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  isAiUnlocked: boolean;
  signInWithEmail: (
    email: string,
    password: string,
    isRegister: boolean,
    marketingConsent: boolean
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email.trim())) {
    throw new Error("Please enter a valid email address.");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const stored = await getUser();
    setUser(stored);
    if (stored && isApiConfigured()) {
      try {
        await syncMealsFromServer();
      } catch {
        await loadMealsForUser(stored.email);
      }
    } else if (stored) {
      await loadMealsForUser(stored.email);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const signInWithEmail = async (
    email: string,
    password: string,
    isRegister: boolean,
    marketingConsent: boolean
  ) => {
    validateEmail(email);
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    if (isRegister && !marketingConsent) {
      throw new Error("Please agree to occasional updates to create an account.");
    }

    if (isApiConfigured()) {
      const response = isRegister
        ? await registerAccount(email, password, marketingConsent)
        : await loginAccount(email, password);

      await saveAuthToken(response.token);
      await saveUser(response.user);
      setUser(response.user);
      await syncMealsFromServer();
      return;
    }

    const profile = isRegister
      ? await registerLocalAccount(email, password, marketingConsent)
      : await loginLocalAccount(email, password);

    await saveAuthToken("local");
    await saveUser(profile);
    setUser(profile);
    await loadMealsForUser(profile.email);
  };

  const signOut = async () => {
    await clearSession();
    await AsyncStorage.removeItem("meals_v2");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAiUnlocked: isAiUnlocked(user),
      signInWithEmail,
      signOut,
      refreshUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

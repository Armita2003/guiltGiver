import InputWithSuffix from "@/components/AddMealsComponents/InputWithSuffix";
import { useAuth } from "@/contexts/AuthContext";
import { estimateMacroGoals } from "@/services/nutritionGoalsService";
import {
  getNutritionGoalsSettings,
  saveNutritionGoalsSettings,
} from "@/storage/nutritionGoalsStorage";
import { colors } from "@/styles/global";
import {
  ActivityLevel,
  BodyProfile,
  GoalsMode,
  MacroGoals,
  Sex,
  WeightGoal,
} from "@/types/nutritionGoals";
import { emit } from "@/utils/events";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const ACTIVITY_OPTIONS: { id: ActivityLevel; label: string }[] = [
  { id: "sedentary", label: "Sedentary" },
  { id: "light", label: "Light" },
  { id: "moderate", label: "Moderate" },
  { id: "active", label: "Active" },
  { id: "very_active", label: "Very Active" },
];

const GOAL_OPTIONS: { id: WeightGoal; label: string }[] = [
  { id: "lose", label: "Lose" },
  { id: "maintain", label: "Maintain" },
  { id: "gain", label: "Gain" },
];

const SEX_OPTIONS: { id: Sex; label: string }[] = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
];

export default function NutritionGoalsCard() {
  const { isAiUnlocked } = useAuth();
  const [mode, setMode] = useState<GoalsMode>("manual");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [country, setCountry] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [weightGoal, setWeightGoal] = useState<WeightGoal>("maintain");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getNutritionGoalsSettings().then((settings) => {
      setMode(settings.mode);
      setGoalsFields(settings.goals);
      if (settings.bodyProfile) {
        setBodyFields(settings.bodyProfile);
      }
    });
  }, []);

  const setGoalsFields = (goals: MacroGoals) => {
    setCalories(String(goals.calories));
    setProtein(String(goals.protein));
    setCarbs(String(goals.carbs));
    setFat(String(goals.fat));
  };

  const setBodyFields = (profile: BodyProfile) => {
    setAge(String(profile.age));
    setHeightCm(String(profile.heightCm));
    setWeightKg(String(profile.weightKg));
    setCountry(profile.country ?? "");
    setSex(profile.sex);
    setActivityLevel(profile.activityLevel);
    setWeightGoal(profile.goal);
  };

  const parseGoals = (): MacroGoals | null => {
    const parsed: MacroGoals = {
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
    };

    if (
      !parsed.calories ||
      !parsed.protein ||
      !parsed.carbs ||
      !parsed.fat ||
      Object.values(parsed).some((v) => v <= 0)
    ) {
      Toast.show({
        type: "error",
        text2: "Enter valid targets for all macros.",
        position: "bottom",
      });
      return null;
    }

    return parsed;
  };

  const parseBodyProfile = (): BodyProfile | null => {
    const parsed: BodyProfile = {
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      sex,
      activityLevel,
      goal: weightGoal,
      country: country.trim() || undefined,
    };

    if (
      !parsed.age ||
      !parsed.heightCm ||
      !parsed.weightKg ||
      parsed.age < 10 ||
      parsed.age > 120 ||
      parsed.heightCm < 100 ||
      parsed.heightCm > 250 ||
      parsed.weightKg < 30 ||
      parsed.weightKg > 300
    ) {
      Toast.show({
        type: "error",
        text2: "Enter valid age, height (cm), and weight (kg).",
        position: "bottom",
      });
      return null;
    }

    return parsed;
  };

  const persistGoals = async (goals: MacroGoals, bodyProfile?: BodyProfile) => {
    await saveNutritionGoalsSettings({
      mode,
      goals,
      bodyProfile,
    });
    emit("goals:updated", goals);
  };

  const handleSaveManual = async () => {
    const goals = parseGoals();
    if (!goals) return;

    setIsSaving(true);
    try {
      await persistGoals(goals);
      Toast.show({
        type: "success",
        text2: "Daily targets saved.",
        position: "bottom",
      });
    } catch {
      Toast.show({
        type: "error",
        text2: "Failed to save targets.",
        position: "bottom",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalculate = async () => {
    if (!isAiUnlocked) {
      Toast.show({
        type: "error",
        text2: "Sign in to use AI target estimates.",
        position: "bottom",
      });
      return;
    }

    const profile = parseBodyProfile();
    if (!profile) return;

    setIsCalculating(true);
    try {
      const goals = await estimateMacroGoals(profile);
      setGoalsFields(goals);
      await persistGoals(goals, profile);
      Toast.show({
        type: "success",
        text2: "AI targets calculated and saved.",
        position: "bottom",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text2:
          error instanceof Error ? error.message : "Failed to calculate targets.",
        position: "bottom",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>DAILY TARGETS</Text>
      <Text style={styles.hint}>
        Set your calorie and macro goals manually or let AI estimate them.
      </Text>

      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, mode === "manual" && styles.modeActive]}
          onPress={() => setMode("manual")}
        >
          <Text
            style={[styles.modeText, mode === "manual" && styles.modeTextActive]}
          >
            Manual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === "ai" && styles.modeActive]}
          onPress={() => setMode("ai")}
        >
          <View style={styles.modeButtonInner}>
            <Text
              style={[styles.modeText, mode === "ai" && styles.modeTextActive]}
            >
              AI Estimate
            </Text>
            {!isAiUnlocked && (
              <MaterialCommunityIcons
                name="lock"
                size={14}
                color={mode === "ai" ? "#283500" : colors.textSecondary}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {mode === "manual" ? (
        <View>
          <InputWithSuffix
            label="CALORIES"
            value={calories}
            onChangeText={setCalories}
            suffix="KCAL"
            placeholder="2000"
          />
          <View style={styles.macrosRow}>
            <View style={styles.macroColumn}>
              <InputWithSuffix
                label="PROTEIN"
                value={protein}
                onChangeText={setProtein}
                suffix="G"
                placeholder="150"
              />
            </View>
            <View style={styles.macroColumn}>
              <InputWithSuffix
                label="CARBS"
                value={carbs}
                onChangeText={setCarbs}
                suffix="G"
                placeholder="250"
              />
            </View>
            <View style={styles.macroColumn}>
              <InputWithSuffix
                label="FAT"
                value={fat}
                onChangeText={setFat}
                suffix="G"
                placeholder="65"
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSaveManual}
            disabled={isSaving}
          >
            <Text style={styles.primaryButtonText}>
              {isSaving ? "Saving..." : "Save Targets"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <InputWithSuffix
                label="AGE"
                value={age}
                onChangeText={setAge}
                suffix="YRS"
                placeholder="30"
              />
            </View>
            <View style={styles.halfField}>
              <InputWithSuffix
                label="HEIGHT"
                value={heightCm}
                onChangeText={setHeightCm}
                suffix="CM"
                placeholder="175"
              />
            </View>
          </View>
          <InputWithSuffix
            label="WEIGHT"
            value={weightKg}
            onChangeText={setWeightKg}
            suffix="KG"
            placeholder="70"
          />
          <View>
            <Text style={styles.fieldLabel}>SEX</Text>
            <View style={styles.chipRow}>
              {SEX_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.chip, sex === option.id && styles.chipActive]}
                  onPress={() => setSex(option.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      sex === option.id && styles.chipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text style={styles.fieldLabel}>ACTIVITY</Text>
            <View style={styles.chipRow}>
              {ACTIVITY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.chip,
                    activityLevel === option.id && styles.chipActive,
                  ]}
                  onPress={() => setActivityLevel(option.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      activityLevel === option.id && styles.chipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text style={styles.fieldLabel}>GOAL</Text>
            <View style={styles.chipRow}>
              {GOAL_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.chip,
                    weightGoal === option.id && styles.chipActive,
                  ]}
                  onPress={() => setWeightGoal(option.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      weightGoal === option.id && styles.chipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text style={styles.fieldLabel}>COUNTRY (OPTIONAL)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. United States"
              placeholderTextColor={colors.gridColors.unfilled}
              value={country}
              onChangeText={setCountry}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!isAiUnlocked || isCalculating) && styles.buttonDisabled,
            ]}
            onPress={handleCalculate}
            disabled={!isAiUnlocked || isCalculating}
          >
            {isCalculating ? (
              <ActivityIndicator color="#283500" />
            ) : (
              <Text style={styles.primaryButtonText}>Calculate Targets</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.depth,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
  modeToggle: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.sutleDepth,
    alignItems: "center",
  },
  modeActive: {
    backgroundColor: colors.button,
  },
  modeButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modeText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  modeTextActive: {
    color: "#283500",
  },
  macrosRow: {
    flexDirection: "row",
    gap: 8,
  },
  macroColumn: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  halfField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 18,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.sutleDepth,
    borderWidth: 1,
    borderColor: colors.depth,
  },
  chipActive: {
    backgroundColor: colors.button,
    borderColor: colors.button,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#283500",
  },
  textInput: {
    backgroundColor: colors.sutleDepth,
    borderRadius: 10,
    marginTop: 10,
    padding: 16,
    color: colors.text,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: colors.button,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  primaryButtonText: {
    color: "#283500",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

import {
  buildInstantSystemStatusFeedback,
  getSystemStatusFeedback,
} from "@/services/guiltFeedbackService";
import { getMacroGoals } from "@/storage/nutritionGoalsStorage";
import { colors, globalStyles } from "@/styles/global";
import { Meal } from "@/types/nutrition";
import { DEFAULT_MACRO_GOALS } from "@/types/nutritionGoals";
import { on } from "@/utils/events";
import { mealsDataHash } from "@/utils/mealDates";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type SystemStatusProps = {
  meals: Meal[];
};

export default function SystemStatus({ meals }: SystemStatusProps) {
  const [goals, setGoals] = useState(DEFAULT_MACRO_GOALS);
  const [aiFeedback, setAiFeedback] = useState<{
    hash: string;
    feedback: ReturnType<typeof buildInstantSystemStatusFeedback>;
  } | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const mealsHash = mealsDataHash(meals);

  const instant = useMemo(
    () => buildInstantSystemStatusFeedback(meals, goals),
    [meals, goals]
  );

  const loadingFeedback = useMemo<
    ReturnType<typeof buildInstantSystemStatusFeedback>
  >(
    () => ({
      statusLabel: "LOADING",
      title: "Checking your damage…",
      subtitle: "The machine is thinking.",
    }),
    []
  );

  const display = useMemo(() => {
    if (aiFeedback?.hash === mealsHash) return aiFeedback.feedback;
    if (isLoadingFeedback && aiFeedback) return aiFeedback.feedback;
    if (isLoadingFeedback) return loadingFeedback;
    return instant;
  }, [aiFeedback, instant, isLoadingFeedback, loadingFeedback, mealsHash]);

  useEffect(() => {
    getMacroGoals().then(setGoals);
    return on("goals:updated", setGoals);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setIsLoadingFeedback(true);

    getSystemStatusFeedback(meals)
      .then((feedback) => {
        if (cancelled) return;
        setAiFeedback({ hash: mealsHash, feedback });
        setIsLoadingFeedback(false);
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoadingFeedback(false);
      });

    return () => {
      cancelled = true;
    };
  }, [meals, mealsHash]);
  return (
    <View style={(globalStyles.sectionSpacing, { marginBottom: 24 })}>
      {isLoadingFeedback ? (
        <ActivityIndicator
          style={{ marginBottom: 12 }}
          size="small"
          color={colors.button}
        />
      ) : null}
      <Text style={globalStyles.subtitle}>
        SYSTEM STATUS: {display.statusLabel}
      </Text>
      <View
        style={{
          // flexDirection: "row",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        {/* <View> */}
        <Text style={globalStyles.sectionTitle}>{display.title}</Text>
        {/* </View> */}
        <Text style={globalStyles.secondarySubTitle}>{display.subtitle}</Text>
      </View>
    </View>
  );
}

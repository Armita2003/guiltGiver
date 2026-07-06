import {
  buildInstantSystemStatusFeedback,
  EMPTY_SYSTEM,
  getSystemStatusFeedback,
} from "@/services/guiltFeedbackService";
import { getMacroGoals } from "@/storage/nutritionGoalsStorage";
import { Meal } from "@/types/nutrition";
import { globalStyles } from "@/styles/global";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type SystemStatusProps = {
  meals: Meal[];
};

export default function SystemStatus({ meals }: SystemStatusProps) {
  const [statusLabel, setStatusLabel] = useState(EMPTY_SYSTEM.statusLabel);
  const [title, setTitle] = useState(EMPTY_SYSTEM.title);
  const [subtitle, setSubtitle] = useState(EMPTY_SYSTEM.subtitle);

  useEffect(() => {
    let cancelled = false;

    const applyInstant = async () => {
      const goals = await getMacroGoals();
      if (cancelled) return;
      const instant = buildInstantSystemStatusFeedback(meals, goals);
      setStatusLabel(instant.statusLabel);
      setTitle(instant.title);
      setSubtitle(instant.subtitle);
    };

    applyInstant();

    getSystemStatusFeedback(meals).then((feedback) => {
      if (cancelled) return;
      setStatusLabel(feedback.statusLabel);
      setTitle(feedback.title);
      setSubtitle(feedback.subtitle);
    });

    return () => {
      cancelled = true;
    };
  }, [meals]);

  return (
    <View style={(globalStyles.sectionSpacing, { marginBottom: 24 })}>
      <Text style={globalStyles.subtitle}>SYSTEM STATUS: {statusLabel}</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={globalStyles.sectionTitle}>{title}</Text>
      </View>
      <Text style={globalStyles.secondarySubTitle}>{subtitle}</Text>
    </View>
  );
}

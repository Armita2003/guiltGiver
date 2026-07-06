import { getSystemStatusFeedback } from "@/services/guiltFeedbackService";
import { Meal } from "@/types/nutrition";
import { globalStyles } from "@/styles/global";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type SystemStatusProps = {
  meals: Meal[];
};

export default function SystemStatus({ meals }: SystemStatusProps) {
  const [statusLabel, setStatusLabel] = useState("UNIMPRESSED");
  const [title, setTitle] = useState("Feed the machine.");
  const [subtitle, setSubtitle] = useState(
    "Did you really need that second snack? Your data says otherwise."
  );

  useEffect(() => {
    let cancelled = false;

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

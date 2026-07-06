import CopyButton from "@/components/CopyButton";
import MacroGrid from "@/components/MacroGrid";
import RecentMeals from "@/components/RecentMeals";
import ReminderToggle from "@/components/ReminderToggle";
import SystemStatus from "@/components/SystemStatus";
import { getMeals } from "@/storage/mealStorage";
import { Meal } from "@/types/nutrition";
import { colors, globalStyles } from "@/styles/global";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { emit } from "@/utils/events";

export default function HomeScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);

  const loadMeals = async () => {
    const data = await getMeals();
    setMeals(data);
    emit("meals:updated", data);
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={[
        globalStyles.container,
        globalStyles.pageContent,
      ]}
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={true}
      overScrollMode="always"
    >
      <SystemStatus meals={meals} />
      <MacroGrid meals={meals} />
      <CopyButton meals={meals} />
      <ReminderToggle />
      <RecentMeals meals={meals} onDelete={loadMeals} />
    </ScrollView>
  );
}

import { getMacroGoals } from "@/storage/nutritionGoalsStorage";
import { Meal } from "@/types/nutrition";
import { DEFAULT_MACRO_GOALS, MacroGoals } from "@/types/nutritionGoals";
import { colors } from "@/styles/global";
import { on } from "@/utils/events";
import { calculateDailyTotals } from "@/utils/nutrition";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import MacroCard from "./MacroCard";
import { gridStyles } from "./MacroGrid.styles";

type MacroGridProps = {
  meals: Meal[];
};

export default function MacroGrid({ meals }: MacroGridProps) {
  const totals = calculateDailyTotals(meals);
  const [goals, setGoals] = useState<MacroGoals>(DEFAULT_MACRO_GOALS);

  const loadGoals = useCallback(async () => {
    setGoals(await getMacroGoals());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [loadGoals])
  );

  useEffect(() => {
    return on("goals:updated", setGoals);
  }, []);

  return (
    <View style={gridStyles.grid}>
      <MacroCard
        label="ENERGY OVERLOAD"
        value={`${totals.calories}`}
        secondaryValue={String(goals.calories)}
        unit=" kcal"
        color={colors.gridColors.primary}
      />
      <MacroCard
        label="PROTEIN"
        value={`${totals.protein ?? 0}`}
        unit="g"
        secondaryValue={String(goals.protein)}
        color={colors.gridColors.secondary}
        halfWidth
      />
      <MacroCard
        label="CARBS"
        value={`${totals.carbs ?? 0}`}
        unit="g"
        secondaryValue={String(goals.carbs)}
        color={colors.gridColors.tertiary}
        halfWidth
      />
      <MacroCard
        label="FAT"
        value={`${totals.fat ?? 0}`}
        unit="g"
        secondaryValue={String(goals.fat)}
        color={colors.gridColors.quaternary}
      />
    </View>
  );
}

import { Meal } from "@/types/nutrition";
import { colors } from "@/styles/global";
import { calculateDailyTotals } from "@/utils/nutrition";
import React from "react";
import { View } from "react-native";
import MacroCard from "./MacroCard";
import { gridStyles } from "./MacroGrid.styles";

type MacroGridProps = {
  meals: Meal[];
};

export default function MacroGrid({ meals }: MacroGridProps) {
  const totals = calculateDailyTotals(meals);

  return (
    <View style={gridStyles.grid}>
      <MacroCard
        label="ENERGY OVERLOAD"
        value={`${totals.calories}`}
        secondaryValue="2000"
        unit=" kcal"
        color={colors.gridColors.primary}
      />
      <MacroCard
        label="PROTEIN"
        value={`${totals.protein ?? 0}`}
        unit="g"
        secondaryValue="150"
        color={colors.gridColors.secondary}
        halfWidth
      />
      <MacroCard
        label="CARBS"
        value={`${totals.carbs ?? 0}`}
        unit="g"
        secondaryValue="250"
        color={colors.gridColors.tertiary}
        halfWidth
      />
      <MacroCard
        label="FAT"
        value={`${totals.fat ?? 0}`}
        unit="g"
        secondaryValue="65"
        color={colors.gridColors.quaternary}
      />
    </View>
  );
}

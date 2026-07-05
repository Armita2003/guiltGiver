import { Meal } from "@/storage/meals";
import { colors } from "@/styles/global";
import React from "react";
import { View } from "react-native";
import MacroCard from "./MacroCard";
import { gridStyles } from "./MacroGrid.styles";

type MacroGridProps = {
  meals: Meal[];
};

export default function MacroGrid({ meals }: MacroGridProps) {
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + (meal.protein ?? 0),
      carbs: acc.carbs + (meal.carbs ?? 0),
      fat: acc.fat + (meal.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

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

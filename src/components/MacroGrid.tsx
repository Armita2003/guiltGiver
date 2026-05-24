import { colors, gridStyles } from "@/styles/global";
import React from "react";
import { View } from "react-native";
import MacroCard from "./MacroCard";

export default function MacroGrid() {
  return (
    <View style={gridStyles.grid}>
      <MacroCard
        label="ENERGY OVERLOAD"
        value="0"
        secondaryValue="2,000"
        color={colors.gridColors.primary}
        width="100%"
      />
      <MacroCard
        label="PROTEIN"
        value="0g"
        secondaryValue="150g"
        color={colors.gridColors.secondary}
      />
      <MacroCard
        label="CARBS"
        value="0g"
        secondaryValue="250g"
        color={colors.gridColors.tertiary}
      />
      <MacroCard
        label="FAT"
        value="10g"
        secondaryValue="65g"
        color={colors.gridColors.quaternary}
        width="100%"
      />
    </View>
  );
}

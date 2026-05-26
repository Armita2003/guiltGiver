import { colors } from "@/styles/global";
import React from "react";
import { View } from "react-native";
import MacroCard from "./MacroCard";
import { gridStyles } from "./MacroGrid.styles";

export default function MacroGrid() {
  return (
    <View style={gridStyles.grid}>
      <MacroCard
        label="ENERGY OVERLOAD"
        value="0"
        secondaryValue="2,000"
        color={colors.gridColors.primary}
      />
      <MacroCard
        label="PROTEIN"
        value="0g"
        secondaryValue="150g"
        color={colors.gridColors.secondary}
        halfWidth
      />
      <MacroCard
        label="CARBS"
        value="0g"
        secondaryValue="250g"
        color={colors.gridColors.tertiary}
        halfWidth
      />
      <MacroCard
        label="FAT"
        value="0g"
        secondaryValue="65g"
        color={colors.gridColors.quaternary}
      />
    </View>
  );
}

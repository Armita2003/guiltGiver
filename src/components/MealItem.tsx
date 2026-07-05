import { colors } from "@/styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { MealItemStyles } from "./MealItem.styles";

type MealItemProps = {
  name: string;
  calories: number;
  time: string;
  icon: string;
  pro?: number;
  carb?: number;
  fat?: number;
};

export default function MealItem({
  name,
  calories,
  time,
  icon,
  pro,
  carb,
  fat,
}: MealItemProps) {
  return (
    <View>
      <View
        style={[
          MealItemStyles.container,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <View style={MealItemStyles.iconContainer}>
            <MaterialCommunityIcons
              name={icon as any}
              size={28}
              color={colors.button}
            />
          </View>
          <View>
            <Text style={MealItemStyles.name}>{name}</Text>
            <Text style={MealItemStyles.time}>{time}</Text>
          </View>
        </View>
        <View style={MealItemStyles.statsContainer}>
          <Text style={MealItemStyles.calories}>{calories} CAL</Text>
          <View style={MealItemStyles.macroContainer}>
            <Text style={MealItemStyles.pro}>{pro}g P</Text>
            <Text style={MealItemStyles.dot}> • </Text>
            <Text style={MealItemStyles.carb}>{carb}g C</Text>
            <Text style={MealItemStyles.dot}> • </Text>
            <Text style={MealItemStyles.fat}>{fat}g F</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

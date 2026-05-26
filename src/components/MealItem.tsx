import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { MealItemStyles } from "./MealItem.styles";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type MealItemProps = {
  name: string;
  calories: number;
  time: string;
  icon: IconName;
};

export default function MealItem({
  name,
  calories,
  time,
  icon,
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
            <Ionicons
              name={icon}
              size={20}
              color={colors.gridColors.secondary}
            />
          </View>
          <View>
            <Text style={MealItemStyles.name}>{name}</Text>
            <Text style={MealItemStyles.time}>{time}</Text>
          </View>
        </View>
        <Text style={MealItemStyles.calories}>{calories} CAL</Text>
      </View>
    </View>
  );
}

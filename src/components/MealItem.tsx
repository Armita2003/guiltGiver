import { deleteMeal } from "@/storage/meals";
import { colors } from "@/styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ConfirmationModal from "./ConfirmationModal";
import { MealItemStyles } from "./MealItem.styles";
type MealItemProps = {
  id: string;
  name: string;
  calories: number;
  time: string;
  icon: string;
  pro?: number;
  carb?: number;
  fat?: number;
  onDelete: () => void;
};

export default function MealItem({
  id,
  name,
  calories,
  time,
  icon,
  pro,
  carb,
  fat,
  onDelete,
}: MealItemProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLongPress = async () => {
    setShowDeleteModal(true);
  };
  return (
    <>
      <TouchableOpacity onLongPress={handleLongPress}>
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
                color={colors.white}
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
      </TouchableOpacity>
      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete meal?"
        message={`Are you sure you want to delete "${name}"?`}
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          await deleteMeal(id);
          setShowDeleteModal(false);

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onDelete();
        }}
      />
    </>
  );
}

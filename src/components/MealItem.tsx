import { deleteMeal } from "@/storage/mealStorage";
import { formatMealTime } from "@/utils/mealDates";
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

  return (
    <>
      <TouchableOpacity onLongPress={() => setShowDeleteModal(true)}>
        <View style={MealItemStyles.container}>
          <View style={MealItemStyles.iconContainer}>
            <MaterialCommunityIcons
              name={icon as any}
              size={28}
              color={colors.white}
            />
          </View>

          <View style={MealItemStyles.detailsContainer}>
            <Text
              style={MealItemStyles.name}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
            <Text style={MealItemStyles.time}>{formatMealTime(time)}</Text>
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
        onConfirm={async () => {
          await deleteMeal(id);
          setShowDeleteModal(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onDelete();
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

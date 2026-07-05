import { deleteMeal } from "@/storage/meals";
import { colors } from "@/styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
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
  const handleLongPress = () => {
    setShowDeleteModal(true);

    // Alert.alert("Delete Meal", `Are you sure you want to delete "${name}"?`, [
    //   { text: "Cancel", style: "cancel" },
    //   {
    //     text: "Delete",
    //     style: "destructive",
    //     onPress: async () => {
    //       await deleteMeal(id);
    //       onDelete();
    //     },
    //   },
    // ]);
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
      </TouchableOpacity>
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={MealItemStyles.overlay}>
          <View style={MealItemStyles.modalCard}>
            <Text style={MealItemStyles.modalTitle}>Delete meal?</Text>
            <Text style={MealItemStyles.modalText}>
              Are you sure you want to delete "{name}"?
            </Text>
            <View style={MealItemStyles.buttonRow}>
              <TouchableOpacity
                style={[MealItemStyles.button, MealItemStyles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={MealItemStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[MealItemStyles.button, MealItemStyles.deleteButton]}
                onPress={async () => {
                  await deleteMeal(id);
                  setShowDeleteModal(false);
                  onDelete();
                }}
              >
                <Text style={MealItemStyles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

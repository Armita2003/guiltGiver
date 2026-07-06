import { deleteMeal } from "@/storage/mealStorage";
import { colors } from "@/styles/global";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ConfirmationModal from "./ConfirmationModal";
import {
  LOG_ACCENT_COLORS,
  LogMealCardStyles,
} from "./LogMealCard.styles";

type LogMealCardProps = {
  id: string;
  name: string;
  time: string;
  note: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  accentIndex: number;
  onDelete: () => void;
};

export default function LogMealCard({
  id,
  name,
  time,
  note,
  calories,
  protein,
  carbs,
  fat,
  accentIndex,
  onDelete,
}: LogMealCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const accent = LOG_ACCENT_COLORS[accentIndex % LOG_ACCENT_COLORS.length];

  return (
    <>
      <TouchableOpacity onLongPress={() => setShowDeleteModal(true)}>
        <View style={LogMealCardStyles.card}>
          <View style={LogMealCardStyles.cardInner}>
            <View
              style={[LogMealCardStyles.accentBar, { backgroundColor: accent }]}
            />
            <View style={LogMealCardStyles.content}>
              <View style={LogMealCardStyles.topRow}>
                <Text style={LogMealCardStyles.name} numberOfLines={2}>
                  {name.toUpperCase()}
                </Text>
                <Text style={[LogMealCardStyles.calories, { color: accent }]}>
                  {calories.toLocaleString()} KCAL
                </Text>
              </View>
              <Text style={LogMealCardStyles.meta}>
                {time} • {note}
              </Text>
              <View style={LogMealCardStyles.macroRow}>
                <View style={LogMealCardStyles.macroItem}>
                  <Text
                    style={[
                      LogMealCardStyles.macroLabel,
                      { color: colors.gridColors.secondary },
                    ]}
                  >
                    PROTEIN
                  </Text>
                  <Text style={LogMealCardStyles.macroValue}>{protein}g</Text>
                </View>
                <View style={LogMealCardStyles.macroItem}>
                  <Text
                    style={[
                      LogMealCardStyles.macroLabel,
                      { color: colors.gridColors.quaternary },
                    ]}
                  >
                    CARBS
                  </Text>
                  <Text style={LogMealCardStyles.macroValue}>{carbs}g</Text>
                </View>
                <View style={LogMealCardStyles.macroItem}>
                  <Text
                    style={[
                      LogMealCardStyles.macroLabel,
                      { color: colors.gridColors.primary },
                    ]}
                  >
                    FAT
                  </Text>
                  <Text style={LogMealCardStyles.macroValue}>{fat}g</Text>
                </View>
              </View>
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

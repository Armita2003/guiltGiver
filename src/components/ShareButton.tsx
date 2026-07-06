import { colors } from "@/styles/global";
import { Meal } from "@/types/nutrition";
import { calculateDailyTotals } from "@/utils/nutrition";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Share, StyleSheet, TouchableOpacity } from "react-native";

type ShareButtonProps = {
  meals: Meal[];
};

export default function ShareButton({ meals }: ShareButtonProps) {
  const handleShare = async () => {
    const totals = calculateDailyTotals(meals);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Share.share({
      message: `Guilt Giver Daily Summary\n\nCalories: ${totals.calories} kcal\nProtein: ${totals.protein}g\nCarbs: ${totals.carbs}g\nFat: ${totals.fat}g\n\nMeals: ${meals.length} logged today`,
    });
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      style={styles.iconContainer}
      activeOpacity={0.75}
      accessibilityLabel="Share"
    >
      <Ionicons name="share-social-sharp" size={24} color={colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    // width: 40,
    // height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

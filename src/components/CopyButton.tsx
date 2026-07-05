import { Meal } from "@/storage/meals";
import { colors, fonts } from "@/styles/global";
import { computeTotals } from "@/utils/meals";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

type CopyButtonProps = {
  meals: Meal[];
};

export default function CopyButton({ meals }: CopyButtonProps) {
  const handleCopy = async () => {
    const totals = computeTotals(meals);

    const summary = `Guilt Giver Daily Summary\n\nCalories: ${totals.calories}\nProtein: ${totals.protein}g\nCarbs: ${totals.carbs}g\nFat: ${totals.fat}g\n\nMeals: ${meals.length} logged today`;

    await Clipboard.setStringAsync(summary);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Alert.alert("Copied!", "Guilt Giver summary copied to clipboard.");

    Toast.show({
      type: "success",
      text1: "Copied!",
      text2: "Guilt Giver summary copied to clipboard!",
      position: "bottom",
    });
  };

  return (
    <TouchableOpacity
      onPress={handleCopy}
      style={styles.button}
      activeOpacity={0.75}
      accessibilityLabel="Copy summary"
    >
      <View style={styles.iconContainer}>
        <Ionicons name="copy-outline" size={16} color={colors.button} />
      </View>
      <Text style={styles.text}>Copy Summary</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    // alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.depth,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
    marginTop: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.sutleDepth,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.button,
    fontSize: 13,
    fontWeight: "600",
    fontFamily: fonts.medium,
  },
});

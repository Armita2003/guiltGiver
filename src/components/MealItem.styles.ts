import { colors } from "@/styles/global";
import { StyleSheet } from "react-native";

const macroStyle = (color: string) => ({
  fontSize: 10,
  fontWeight: "medium" as const,
  color,
});

export const MealItemStyles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "semibold",
    color: "#E5E2E1",
    marginBottom: 16,
  },
  container: {
    backgroundColor: "#161616",
    padding: 16,
    borderWidth: 1,
    borderColor: "#282825",
  },
  name: {
    fontSize: 12,
    fontWeight: "medium",
    color: "#ffffff",
  },
  time: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  calories: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#353534",
    justifyContent: "center",
    alignItems: "center",
  },
  pro: macroStyle(colors.gridColors.secondary),
  carb: macroStyle(colors.gridColors.tertiary),
  fat: macroStyle(colors.gridColors.quaternary),
  dot: macroStyle("#E5E2E1"),
  macroContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsContainer: {
    alignItems: "flex-end",
  },
});

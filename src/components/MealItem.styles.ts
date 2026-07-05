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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#282825",
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#282825",
  },
  deleteButton: {
    backgroundColor: colors.alert,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});

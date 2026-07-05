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
    color: colors.white,
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
    backgroundColor: "rgba(0,0,0,0.78)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.depth,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 4,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2f2f2f",
  },
  cancelButton: {
    backgroundColor: colors.sutleDepth,
  },
  deleteButton: {
    backgroundColor: colors.alert,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
});

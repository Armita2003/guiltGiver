import { StyleSheet } from "react-native";

export const colors = {
  // background: "#1a1a2e",
  // header: "#242444",
  header: "#131313",
  surface: "#171815",
  primary: "#4fc3f7",
  // text: "#ffffff",
  text: "#ccff00",
  textSecondary: "#a0a0b0",
  alert: "#ff5252",
  background: "#0F0F0F",
  primaryActions: "#ccff00",
  secondaryActions: "#00e5ff",
  warning: "#f2ff00",
  regrets: "#ff3b30",
  depth: "#393939",
  sutleDepth: "#1c1b1b",
  gridColors: {
    primary: "#FFB4AB",
    secondary: "#ABD600",
    tertiary: "#FF5E07",
    quaternary: "#00DBE9",
    unfilled: "#353534",
  },
  button: "#C3F400",
};

export const globalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: colors.background,
    paddingTop: 16,
    paddingHorizontal: 20,
    flexShrink: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "medium",
    color: colors.gridColors.secondary,
  },
  secondaryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E5E2E1",
  },

  secondarySubTitle: {
    fontSize: 14,
    fontWeight: "regular",
    color: "#C4C9AC",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textSecondary,
    // marginTop: 30,
    // marginBottom: 16,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: {
    color: "#007bff",
    fontSize: 18,
    // textDecorationLine: "underline",
  },
});

import { StyleSheet } from "react-native";

export const fonts = {
  regular: "Montserrat-Regular",
  medium: "Montserrat-Medium",
  semibold: "Montserrat-SemiBold",
  bold: "Montserrat-Bold",
};

export const colors = {
  header: "#131313",
  surface: "#171815",
  primary: "#4fc3f7",
  text: "#ccff00",
  textSecondary: "#a0a0b0",
  textTertiary: "#C4C9AC",
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
  white: "#ffffff",
};

export const globalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingTop: 34,
    flexShrink: 0,
    paddingLeft: 20,
    paddingRight: 20,
  },
  pageContent: {
    // marginTop: 30,
    marginBottom: 30,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#E5E2E1",
  },
  sectionSpacing: {
    gap: 4,
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
  emptyList: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 24,
  },
});

import { StyleSheet } from "react-native";

export const colors = {
  // background: "#1a1a2e",
  // header: "#242444",
  header: "rgba(19, 19, 19, 0.8)",
  surface: "#2a2a4a",
  primary: "#4fc3f7",
  // text: "#ffffff",
  text: "#ccff00",
  textSecondary: "#a0a0b0",
  alert: "#ff5252",
  background: "#131313",
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
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 30,
    marginBottom: 16,
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

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    // width: "48%",
    borderLeftWidth: 4,
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: "#C4C9AC",
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    alignSelf: "center",
  },
  secondaryValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#C4C9AC",
    marginTop: 8,
    alignSelf: "center",
  },
});
export const gridStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});

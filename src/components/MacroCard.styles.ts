import { StyleSheet } from "react-native";

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

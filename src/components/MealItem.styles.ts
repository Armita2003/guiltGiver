import { StyleSheet } from "react-native";

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
    color: "#C4C9AC",
  },
  calories: {
    fontSize: 12,
    color: "#C4C9AC",
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#353534",
    justifyContent: "center",
    alignItems: "center",
  },
});

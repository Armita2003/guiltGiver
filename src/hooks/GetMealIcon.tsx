import { colors } from "@/styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function GetMealIcon (category: string) {
  switch (category) {
    case "protein":
      return (
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={20}
          color={colors.gridColors.secondary}
        />
      );

    case "fastFood":
      return (
        <MaterialCommunityIcons
          name="hamburger"
          size={20}
          color={colors.gridColors.secondary}
        />
      );

    case "healthy":
      return (
        <MaterialCommunityIcons
          name="leaf"
          size={20}
          color={colors.gridColors.secondary}
        />
      );

    case "snack":
      return (
        <MaterialCommunityIcons
          name="cookie"
          size={20}
          color={colors.gridColors.secondary}
        />
      );

    case "drink":
      return (
        <MaterialCommunityIcons
          name="cup"
          size={20}
          color={colors.gridColors.secondary}
        />
      );

    default:
      return (
        <MaterialCommunityIcons
          name="food"
          size={20}
          color={colors.gridColors.secondary}
        />
      );
  }
};
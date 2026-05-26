import { Text, View } from "react-native";
import MealItem from "./MealItem";
import { MealItemStyles } from "./MealItem.styles";

export default function RecentMeals() {
  return (
    <View style={{ marginVertical: 24, gap: 8 }}>
      <Text style={MealItemStyles.title}>RECENT FAILURES</Text>
      <MealItem
        name="Chicken & Rice"
        calories={540}
        time="7:30 PM"
        icon="fast-food-outline"
      />
      <MealItem
        name="Protein Shake"
        calories={280}
        time="9:00 AM"
        icon="nutrition-outline"
      />
      <MealItem
        name="Salmon Salad"
        calories={430}
        time="12:45 PM"
        icon="leaf-outline"
      />
      <MealItem
        name="Chicken & Rice"
        calories={540}
        time="7:30 PM"
        icon="fast-food-outline"
      />
    </View>
  );
}

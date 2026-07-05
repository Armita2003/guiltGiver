import { categoryToIcon, Meal } from "@/storage/meals";
import { colors } from "@/styles/global";
import { Text, View } from "react-native";
import MealItem from "./MealItem";
import { MealItemStyles } from "./MealItem.styles";

type RecentMealsProps = {
  meals: Meal[];
};

export default function RecentMeals({ meals }: RecentMealsProps) {
  return (
    <View style={{ marginVertical: 24, gap: 8 }}>
      <Text style={MealItemStyles.title}>RECENT FAILURES</Text>
      {meals.length === 0 ? (
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          No meals logged yet.
        </Text>
      ) : (
        meals.map((meal) => (
          <MealItem
            key={meal.id}
            time={meal.createdAt}
            name={meal.name}
            calories={meal.calories}
            icon={categoryToIcon[meal.selectedCategory]}
            pro={meal.protein}
            carb={meal.carbs}
            fat={meal.fat}
          />
        ))
      )}
    </View>
  );
}

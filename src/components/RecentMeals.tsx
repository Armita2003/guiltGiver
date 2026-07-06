import { categoryToIcon, Meal } from "@/types/nutrition";
import { globalStyles } from "@/styles/global";
import { Text, View } from "react-native";
import MealItem from "./MealItem";
import { MealItemStyles } from "./MealItem.styles";

type RecentMealsProps = {
  meals: Meal[];
  onDelete: () => void;
};

export default function RecentMeals({ meals, onDelete }: RecentMealsProps) {
  return (
    <View style={{ marginVertical: 24, gap: 8 }}>
      <Text style={MealItemStyles.title}>RECENT FAILURES</Text>
      {meals.length === 0 ? (
        <Text style={globalStyles.emptyList}>No meals logged yet.</Text>
      ) : (
        meals
          .slice(0, 5)
          .map((meal) => (
            <MealItem
              key={meal.id}
              id={meal.id}
              time={meal.createdAt}
              name={meal.mealName}
              calories={meal.totalCalories}
              icon={categoryToIcon[meal.category]}
              pro={meal.totalProtein}
              carb={meal.totalCarbs}
              fat={meal.totalFat}
              onDelete={onDelete}
            />
          ))
      )}
    </View>
  );
}

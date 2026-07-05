import { categoryToIcon, Meal } from "@/storage/meals";
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
              name={meal.name}
              calories={meal.calories}
              icon={categoryToIcon[meal.selectedCategory]}
              pro={meal.protein}
              carb={meal.carbs}
              fat={meal.fat}
              onDelete={onDelete}
            />
          ))
      )}
    </View>
  );
}

import ConfirmationModal from "@/components/ConfirmationModal";
import MealItem from "@/components/MealItem";
import { MealItemStyles } from "@/components/MealItem.styles";
import { categoryToIcon, clearAllMeals, getMeals, Meal } from "@/storage/meals";
import { colors, globalStyles } from "@/styles/global";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MealsScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showClearModal, setShowClearModal] = useState(false);

  const loadMeals = async () => {
    const data = await getMeals();
    setMeals(data);
  };

  const handleClearAll = async () => {
    await clearAllMeals();
    setShowClearModal(false);
    loadMeals();
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={[globalStyles.container, globalStyles.pageContent]}
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false} // Hide ugly scrollbar
      keyboardShouldPersistTaps="handled" // Allow taps while keyboard is open
      bounces={true} // iOS bounce effect (optional)
      overScrollMode="always"
    >
      <View style={globalStyles.sectionSpacing}>
        <Text style={globalStyles.sectionTitle}>All Meals</Text>
        <Text style={globalStyles.secondarySubTitle}>
          Your meals will appear here as you log them.
        </Text>

        <TouchableOpacity
          style={[
            MealItemStyles.button,
            MealItemStyles.deleteButton,
            {
              marginTop: 12,
              alignContent: "center",
              alignItems: "center",
            },
          ]}

          onPress={() => setShowClearModal(true)}
        >
          <Text style={MealItemStyles.buttonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <ConfirmationModal
        visible={showClearModal}
        title="Clear all meals?"
        message="This will remove every meal from your list."
        cancelLabel="Cancel"
        confirmLabel="Clear"
        onCancel={() => setShowClearModal(false)}
        onConfirm={handleClearAll}
      />

      <View style={{ marginTop: 30 }}>
        {meals.length === 0 ? (
          <Text style={globalStyles.emptyList}>No meals logged yet.</Text>
        ) : (
          meals.map((meal) => (
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
              onDelete={loadMeals}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

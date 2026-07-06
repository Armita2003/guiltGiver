import ConfirmationModal from "@/components/ConfirmationModal";
import LogMealCard from "@/components/LogMealCard";
import { LogMealCardStyles } from "@/components/LogMealCard.styles";
import { MealItemStyles } from "@/components/MealItem.styles";
import {
  formatSectionHeader,
  getDayLabel,
  getLogPageFeedback,
  getMealNote,
  LogPageFeedback,
} from "@/services/guiltFeedbackService";
import { clearAllMeals, getMeals } from "@/storage/mealStorage";
import { Meal } from "@/types/nutrition";
import {
  formatMealTime,
  getDateKey,
  groupMealsByDate,
  isLateNightMeal,
} from "@/utils/mealDates";
import { calculateDailyTotals } from "@/utils/nutrition";
import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FilterTab = "all" | "highCalorie" | "lateNight";

const HIGH_CALORIE_THRESHOLD = 500;

export default function MealsScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showClearModal, setShowClearModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [feedback, setFeedback] = useState<LogPageFeedback>({
    dayLabels: {},
    mealNotes: {},
  });

  const loadMeals = async () => {
    const data = await getMeals();
    setMeals(data);
    getLogPageFeedback(data).then(setFeedback);
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

  const filteredMeals = useMemo(() => {
    let result = meals;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((m) => m.mealName.toLowerCase().includes(q));
    }

    if (filter === "highCalorie") {
      result = result.filter((m) => m.totalCalories >= HIGH_CALORIE_THRESHOLD);
    } else if (filter === "lateNight") {
      result = result.filter((m) => isLateNightMeal(m.createdAt));
    }

    return result;
  }, [meals, search, filter]);

  const groupedMeals = useMemo(
    () => groupMealsByDate(filteredMeals),
    [filteredMeals]
  );

  const todayKey = getDateKey(new Date().toISOString());

  const filters: { key: FilterTab; label: string }[] = [
    { key: "all", label: "ALL SHAME" },
    { key: "highCalorie", label: "HIGH CALORIE" },
    { key: "lateNight", label: "LATE NIGHT" },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        globalStyles.container,
        globalStyles.pageContent,
      ]}
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={globalStyles.sectionSpacing}>
        <Text style={globalStyles.sectionTitle}>FAILURE LOG</Text>
        <Text style={LogMealCardStyles.pageSubtitle}>
          THE EVIDENCE OF YOUR LACK OF DISCIPLINE.
        </Text>

        <View style={{ marginTop: 16, position: "relative" }}>
          <Ionicons
            name="search"
            size={16}
            color={colors.textTertiary}
            style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}
          />
          <TextInput
            style={[LogMealCardStyles.searchInput, { paddingLeft: 40 }]}
            placeholder="SEARCH FOR SPECIFIC FAILURES..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="characters"
          />
        </View>

        <View style={LogMealCardStyles.filterRow}>
          {filters.map(({ key, label }) => {
            const active = filter === key;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  LogMealCardStyles.filterTab,
                  active && LogMealCardStyles.filterTabActive,
                ]}
                onPress={() => setFilter(key)}
              >
                <Text
                  style={[
                    LogMealCardStyles.filterText,
                    active && LogMealCardStyles.filterTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            MealItemStyles.button,
            MealItemStyles.deleteButton,
            { alignItems: "center" },
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

      <View style={{ marginTop: 8 }}>
        {filteredMeals.length === 0 ? (
          <Text style={globalStyles.emptyList}>
            {meals.length === 0
              ? "No meals logged yet."
              : "No failures match your filters."}
          </Text>
        ) : (
          [...groupedMeals.entries()].map(([dateKey, dayMeals]) => {
            const dayTotals = calculateDailyTotals(dayMeals);
            const isToday = dateKey === todayKey;
            const insult = getDayLabel(feedback, dateKey);

            return (
              <View key={dateKey}>
                <View style={LogMealCardStyles.sectionHeader}>
                  <Text
                    style={[
                      LogMealCardStyles.sectionTitle,
                      {
                        color: isToday ? colors.text : colors.textTertiary,
                      },
                    ]}
                  >
                    {formatSectionHeader(dateKey, insult)}
                  </Text>
                  <Text style={LogMealCardStyles.sectionCalories}>
                    {dayTotals.calories.toLocaleString()} KCAL
                  </Text>
                </View>

                {dayMeals.map((meal, index) => (
                  <LogMealCard
                    key={meal.id}
                    id={meal.id}
                    name={meal.mealName}
                    time={formatMealTime(meal.createdAt)}
                    note={getMealNote(feedback, meal)}
                    calories={meal.totalCalories}
                    protein={meal.totalProtein}
                    carbs={meal.totalCarbs}
                    fat={meal.totalFat}
                    accentIndex={index}
                    onDelete={loadMeals}
                  />
                ))}
              </View>
            );
          })
        )}
      </View>

      {filteredMeals.length > 0 && (
        <View style={LogMealCardStyles.footerBox}>
          <Text style={LogMealCardStyles.footerText}>
            SCROLLING THROUGH MORE DATA WILL NOT MAKE YOU THINNER
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

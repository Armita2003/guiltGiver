import InputWithSuffix from "@/components/AddMealsComponents/InputWithSuffix";
import { addMeal, MealCategory } from "@/storage/meals";
import { colors, fonts, globalStyles } from "@/styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type IconName = "dumbbell" | "food" | "leaf" | "cookie" | "cup";

export default function AddMealScreen() {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | null>(
    null
  );

  const categories: Array<{ id: MealCategory; title: string; icon: IconName }> =
    [
      { id: "protein", title: "Protein", icon: "dumbbell" },
      { id: "fastFood", title: "Fast Food", icon: "food" },
      { id: "healthy", title: "Healthy", icon: "leaf" },
      { id: "snack", title: "Snack", icon: "cookie" },
      { id: "drink", title: "Drink", icon: "cup" },
    ];

  const handleAddMeal = async () => {
    if (!name || !calories || !selectedCategory) {
      Toast.show({
        type: "error",
        text2: "Please enter a meal name, calories and select a category.",
        position: "bottom",
      });

      return;
    }

    await addMeal({
      name,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      selectedCategory,
    });

    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setSelectedCategory(null);

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Meal added successfully!",
      position: "bottom",
    });
    router.push("/");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        bounces={true}
        overScrollMode="always"
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={[
          globalStyles.container,
          globalStyles.pageContent,
          styles.scrollContent,
        ]}
      >
        <Text style={globalStyles.secondaryTitle}>LOG YOUR FAILURE</Text>
        <Text style={globalStyles.secondarySubTitle}>
          DON'T LIE TO YOURSELF. WE'LL KNOW.
        </Text>
        <View style={{ marginTop: 12 }}>
          <View>
            <Text style={styles.label}>Meal name</Text>
            <TextInput
              style={styles.input}
              placeholder="ANOTHER PIZZA?"
              placeholderTextColor={colors.gridColors.unfilled}
              value={name}
              onChangeText={setName}
            />
          </View>
          <InputWithSuffix
            label="CALORIES"
            value={calories}
            onChangeText={setCalories}
            suffix="KCAL"
            placeholder="0"
          />
          <View style={styles.macrosRow}>
            <View style={styles.macroColumn}>
              <InputWithSuffix
                label="PROTEIN"
                value={protein}
                onChangeText={setProtein}
                suffix="G"
                placeholder="0"
              />
            </View>

            <View style={styles.macroColumn}>
              <InputWithSuffix
                label="CARBS"
                value={carbs}
                onChangeText={setCarbs}
                suffix="G"
                placeholder="0"
              />
            </View>

            <View style={styles.macroColumn}>
              <InputWithSuffix
                label="FAT"
                value={fat}
                onChangeText={setFat}
                suffix="G"
                placeholder="0"
              />
            </View>
          </View>

          <View style={styles.categoryRow}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.categoryButton}
                onPress={() => {
                  Keyboard.dismiss();
                  setSelectedCategory(item.id);
                }}
              >
                <View
                  style={[
                    styles.iconBox,
                    selectedCategory === item.id && {
                      borderWidth: 2,
                      borderColor: colors.button,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={colors.button}
                  />
                </View>

                <Text style={styles.categoryText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
                marginBottom: 24,
              },
            ]}
            onPress={() => {
              Keyboard.dismiss();
              handleAddMeal();
            }}
          >
            <Text style={styles.buttonText}>ADD TO THE LOG</Text>
            <Image
              source={require("../../../assets/images/AddLogIcon.svg")}
              style={{ width: 20, height: 12 }}
            />
          </TouchableOpacity>
          <Text style={styles.postScriptText}>
            Your secret is safe with us. Just kidding, it's in the cloud
            forever.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 16,
  },
  macrosRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  macroColumn: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 18,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.button,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#283500",
    fontSize: 24,
    fontFamily: fonts.bold,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },

  categoryButton: {
    alignItems: "center",
  },

  selectedCategory: {
    opacity: 0.8,
  },

  categoryText: {
    color: colors.textSecondary,
    marginTop: 8,
    fontSize: 11,
    textTransform: "uppercase",
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#454545",
    justifyContent: "center",
    alignItems: "center",
  },

  postScriptText: {
    fontSize: 10,
    fontWeight: "regular",
    color: "#C4C9AC",
    opacity: 0.4,
    textAlign: "center",
    paddingBottom: 12,
  },
});

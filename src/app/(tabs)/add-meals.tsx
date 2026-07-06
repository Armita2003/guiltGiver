import InputWithSuffix from "@/components/AddMealsComponents/InputWithSuffix";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  analyzeMealImage,
  analyzeMealText,
} from "@/services/openRouterService";
import { addMeal } from "@/storage/mealStorage";
import { colors, fonts, globalStyles } from "@/styles/global";
import { FoodItem, MealCategory } from "@/types/nutrition";
import { inferMealCategory } from "@/utils/mealCategory";
import { calculateMealTotals } from "@/utils/nutrition";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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

type EntryMode = "manual" | "ai";
type IconName = "dumbbell" | "food" | "leaf" | "cookie" | "cup";

const categories: Array<{ id: MealCategory; title: string; icon: IconName }> =
  [
    { id: "protein", title: "Protein", icon: "dumbbell" },
    { id: "fastFood", title: "Fast Food", icon: "food" },
    { id: "healthy", title: "Healthy", icon: "leaf" },
    { id: "snack", title: "Snack", icon: "cookie" },
    { id: "drink", title: "Drink", icon: "cup" },
  ];

export default function AddMealScreen() {
  const { isAiUnlocked, user } = useAuth();
  const [mode, setMode] = useState<EntryMode>("manual");
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | null>(
    null
  );

  const [mealText, setMealText] = useState("");
  const [analyzedFoods, setAnalyzedFoods] = useState<FoodItem[] | null>(null);
  const [aiMealName, setAiMealName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const resetAiState = () => {
    setMealText("");
    setAnalyzedFoods(null);
    setAiMealName("");
    setPreviewUri(null);
  };

  const resetManualState = () => {
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setSelectedCategory(null);
  };

  const handleAddManualMeal = async () => {
    if (!user) {
      setAuthModalVisible(true);
      return;
    }

    if (!name || !calories || !selectedCategory) {
      Toast.show({
        type: "error",
        text2: "Please enter a meal name, calories and select a category.",
        position: "bottom",
      });
      return;
    }

    const food: FoodItem = {
      name,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    };

    try {
      await addMeal(name, [food], selectedCategory);
      resetManualState();
      showSuccess();
    } catch (error) {
      Toast.show({
        type: "error",
        text2: error instanceof Error ? error.message : "Failed to save meal.",
        position: "bottom",
      });
    }
  };

  const handleAnalyzeText = async () => {
    if (!mealText.trim()) {
      Toast.show({
        type: "error",
        text2: "Describe your meal first.",
        position: "bottom",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeMealText(mealText);
      setAnalyzedFoods(analysis.foods);
      setAiMealName(analysis.foods.map((f) => f.name).join(", "));
      setPreviewUri(null);
    } catch (error) {
      Toast.show({
        type: "error",
        text2:
          error instanceof Error ? error.message : "Failed to analyze meal.",
        position: "bottom",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text2: "Camera or photo library permission is required.",
        position: "bottom",
      });
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 0.8,
        });

    if (result.canceled || !result.assets[0]) return;

    const uri = result.assets[0].uri;
    setPreviewUri(uri);
    setIsAnalyzing(true);

    try {
      const analysis = await analyzeMealImage(uri);
      setAnalyzedFoods(analysis.foods);
      setAiMealName(analysis.foods.map((f) => f.name).join(", "));
    } catch (error) {
      setPreviewUri(null);
      Toast.show({
        type: "error",
        text2:
          error instanceof Error ? error.message : "Failed to analyze image.",
        position: "bottom",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAiMeal = async () => {
    if (!analyzedFoods?.length || !aiMealName.trim()) {
      Toast.show({
        type: "error",
        text2: "Analyze a meal and enter a name before saving.",
        position: "bottom",
      });
      return;
    }

    try {
      await addMeal(
        aiMealName.trim(),
        analyzedFoods,
        inferMealCategory(aiMealName, analyzedFoods, mealText)
      );
      resetAiState();
      showSuccess();
    } catch (error) {
      Toast.show({
        type: "error",
        text2: error instanceof Error ? error.message : "Failed to save meal.",
        position: "bottom",
      });
    }
  };

  const showSuccess = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Meal added successfully!",
      position: "bottom",
    });
    router.push("/");
  };

  const aiTotals = analyzedFoods ? calculateMealTotals(analyzedFoods) : null;
  const aiLocked = !isAiUnlocked;

  const handleAiTabPress = () => {
    if (aiLocked) {
      setAuthModalVisible(true);
      return;
    }
    setMode("ai");
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
        <View style={globalStyles.sectionSpacing}>
          <Text style={globalStyles.sectionTitle}>LOG YOUR FAILURE</Text>
          <Text style={globalStyles.secondarySubTitle}>
            Don't lie to yourself. We'll know.
          </Text>
        </View>

        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === "manual" && styles.modeActive]}
            onPress={() => setMode("manual")}
          >
            <Text
              style={[
                styles.modeText,
                mode === "manual" && styles.modeTextActive,
              ]}
            >
              Manual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === "ai" && styles.modeActive]}
            onPress={handleAiTabPress}
          >
            <View style={styles.modeButtonInner}>
              <Text
                style={[
                  styles.modeText,
                  mode === "ai" && styles.modeTextActive,
                ]}
              >
                AI Estimate
              </Text>
              {aiLocked && (
                <MaterialCommunityIcons
                  name="lock"
                  size={14}
                  color={mode === "ai" ? "#283500" : colors.textSecondary}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {mode === "manual" ? (
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
                      color={
                        selectedCategory === item.id
                          ? colors.button
                          : colors.textSecondary
                      }
                    />
                  </View>
                  <Text style={styles.categoryText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.button, styles.buttonRow]}
              onPress={() => {
                Keyboard.dismiss();
                handleAddManualMeal();
              }}
            >
              <Text style={styles.buttonText}>ADD TO THE LOG</Text>
              <Image
                source={require("../../../assets/images/AddLogIcon.svg")}
                style={{ width: 20, height: 12 }}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginTop: 12 }}>
            {aiLocked && (
              <TouchableOpacity
                style={styles.lockedBanner}
                onPress={() => setAuthModalVisible(true)}
              >
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={18}
                  color={colors.button}
                />
                <Text style={styles.lockedBannerText}>
                  Enter your email to unlock AI features
                </Text>
              </TouchableOpacity>
            )}
            <Text style={styles.label}>Describe your meal</Text>
            <TextInput
              style={[styles.input, styles.textArea, aiLocked && styles.inputDisabled]}
              placeholder="2 scrambled eggs, 2 slices of toast, 1 banana"
              placeholderTextColor={colors.gridColors.unfilled}
              value={mealText}
              onChangeText={setMealText}
              multiline
              editable={!aiLocked}
            />
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                aiLocked && styles.buttonDisabled,
              ]}
              onPress={aiLocked ? () => setAuthModalVisible(true) : handleAnalyzeText}
              disabled={isAnalyzing}
            >
              {isAnalyzing && !previewUri ? (
                <ActivityIndicator color={colors.button} />
              ) : (
                <Text style={styles.secondaryButtonText}>ANALYZE TEXT</Text>
              )}
            </TouchableOpacity>

            <View style={styles.photoRow}>
              <TouchableOpacity
                style={[
                  styles.photoButton,
                  styles.photoButtonHalf,
                  aiLocked && styles.buttonDisabled,
                ]}
                onPress={
                  aiLocked ? () => setAuthModalVisible(true) : () => pickImage(true)
                }
                disabled={isAnalyzing}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={22}
                  color={colors.button}
                />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.photoButton,
                  styles.photoButtonHalf,
                  aiLocked && styles.buttonDisabled,
                ]}
                onPress={
                  aiLocked ? () => setAuthModalVisible(true) : () => pickImage(false)
                }
                disabled={isAnalyzing}
              >
                <MaterialCommunityIcons
                  name="image"
                  size={22}
                  color={colors.button}
                />
                <Text style={styles.photoButtonText}>Upload Photo</Text>
              </TouchableOpacity>
            </View>

            {previewUri && (
              <Image
                source={{ uri: previewUri }}
                style={styles.previewImage}
                contentFit="cover"
              />
            )}

            {isAnalyzing && previewUri && (
              <ActivityIndicator
                color={colors.button}
                style={{ marginVertical: 16 }}
              />
            )}

            {analyzedFoods && analyzedFoods.length > 0 && (
              <View style={styles.resultsBox}>
                <Text style={styles.resultsLabel}>Meal name</Text>
                <TextInput
                  style={styles.resultsMealName}
                  value={aiMealName}
                  onChangeText={setAiMealName}
                  placeholderTextColor={colors.gridColors.unfilled}
                  multiline
                  scrollEnabled={false}
                  textAlignVertical="top"
                />
                <Text style={styles.resultsLabel}>Estimated foods</Text>
                {analyzedFoods.map((food, index) => (
                  <View key={`${food.name}-${index}`} style={styles.foodRow}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodMacros}>
                      {food.calories} kcal · {food.protein}g P · {food.carbs}g C
                      · {food.fat}g F
                    </Text>
                  </View>
                ))}
                {aiTotals && (
                  <Text style={styles.totalsText}>
                    Totals: {aiTotals.totalCalories} kcal ·{" "}
                    {aiTotals.totalProtein}g P · {aiTotals.totalCarbs}g C ·{" "}
                    {aiTotals.totalFat}g F
                  </Text>
                )}
                <TouchableOpacity
                  style={[styles.button, styles.buttonRow, { marginTop: 20 }]}
                  onPress={handleSaveAiMeal}
                >
                  <Text style={styles.buttonText}>SAVE MEAL</Text>
                  <Image
                    source={require("../../../assets/images/AddLogIcon.svg")}
                    style={{ width: 20, height: 12 }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <Text style={styles.postScriptText}>
          Your secret is safe with us. Just kidding, it's in the cloud forever.
        </Text>
      </ScrollView>

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={() => setMode("ai")}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  modeToggle: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  modeButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modeActive: {
    backgroundColor: colors.button,
  },
  modeText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  modeTextActive: {
    color: "#283500",
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 8,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  macrosRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  macroColumn: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
  categoryButton: {
    alignItems: "center",
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
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 18,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: colors.button,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "#283500",
    fontSize: 24,
    fontFamily: fonts.bold,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.button,
  },
  secondaryButtonText: {
    color: colors.button,
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  photoRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.depth,
  },
  photoButtonHalf: {
    flex: 1,
  },
  photoButtonText: {
    color: colors.button,
    fontSize: 12,
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 16,
  },
  resultsBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 10,
  },
  resultsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultsMealName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    padding: 0,
    margin: 0,
    borderTopWidth: 1,
    borderTopColor: colors.depth,
  },
  foodRow: {
    // marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.depth,
  },
  foodName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    flexWrap: "wrap",
  },
  foodMacros: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    flexWrap: "wrap",
  },
  totalsText: {
    color: colors.button,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 16,
  },
  postScriptText: {
    fontSize: 10,
    fontWeight: "regular",
    color: colors.textTertiary,
    opacity: 0.4,
    textAlign: "center",
    paddingTop: 12,
    paddingBottom: 12,
  },
  lockedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.sutleDepth,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.depth,
  },
  lockedBannerText: {
    color: colors.button,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

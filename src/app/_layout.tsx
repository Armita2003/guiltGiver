import AuthModal from "@/components/AuthModal";
import ShareButton from "@/components/ShareButton";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { getMeals } from "@/storage/mealStorage";
import { colors, fonts, globalStyles } from "@/styles/global";
import { Meal } from "@/types/nutrition";
import { on } from "@/utils/events";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router, Stack, useFocusEffect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export { emit, on } from "@/utils/events";

function HeaderRight({
  meals,
  onAvatarPress,
}: {
  meals: Meal[];
  onAvatarPress: () => void;
}) {
  const { user } = useAuth();

  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <ShareButton meals={meals} />
      <Pressable
        onPress={() => {
          if (user) {
            router.push("/profile");
          } else {
            onAvatarPress();
          }
        }}
      >
        <Ionicons name="person-circle-outline" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    [fonts.bold]: require("../../assets/fonts/Montserrat-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.primary,
          backgroundColor: "#1f2937",
          borderRadius: 14,
          minHeight: 76,
          paddingVertical: 8,
          paddingHorizontal: 4,
          height: "100%",
        }}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingVertical: 6,
          flexShrink: 1,
        }}
        text1Style={{
          fontSize: 15,
          fontWeight: "600",
          color: "#fff",
          flexWrap: "wrap",
        }}
        text1NumberOfLines={2}
        text2NumberOfLines={6}
        text2Style={{
          fontSize: 13,
          color: "#ddd",
          flexWrap: "wrap",
          flexShrink: 1,
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: colors.alert,
          backgroundColor: "#1f2937",
          borderRadius: 14,
          minHeight: 76,
          paddingVertical: 8,
          paddingHorizontal: 4,
          height: "100%",
        }}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingVertical: 6,
          flexShrink: 1,
        }}
        text1Style={{ fontSize: 15, fontWeight: "600", color: "#fff" }}
        text2NumberOfLines={6}
        text2Style={{
          fontSize: 13,
          color: "#ddd",
          flexWrap: "wrap",
          flexShrink: 1,
        }}
      />
    ),
  };

  const loadMeals = async () => {
    const data = await getMeals();
    setMeals(data);
  };

  useEffect(() => {
    const unsubscribe = on("meals:updated", (updatedMeals) => {
      setMeals(updatedMeals);
    });

    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  if (!fontsLoaded) {
    return null; // Or render a loading spinner
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          // Global header styles (applies to all screens)
          headerStyle: {
            backgroundColor: colors.header,
          },

          headerTintColor: colors.text, // Color for back button, icons
        }}
      >
        <Stack.Screen
          name="(tabs)"

          options={{
            // ✅ Custom title with your style
            headerTitle: () => (
              <Text style={[globalStyles.title, { paddingLeft: 8 }]}>
                Guilt Giver
              </Text>
            ),
            // headerTitleAlign: "center", // Center the title

            // ✅ Hamburger menu on the left
            // headerLeft: () => (
            //   <Pressable onPress={() => emit("menu:open")}>
            //     <Ionicons name="menu" size={24} color={colors.white} />
            //   </Pressable>
            // ),
            headerRight: () => (
              <HeaderRight
                meals={meals}
                onAvatarPress={() => setAuthModalVisible(true)}
              />
            ),
            headerShadowVisible: false,
          }}
        />
      </Stack>
      <Toast config={toastConfig} bottomOffset={90} />
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </AuthProvider>
  );
}

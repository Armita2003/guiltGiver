import { colors, fonts, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useCallback } from "react";
import { Pressable, Text } from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
type EventMap = { "menu:open": () => void };
const listeners: { [K in keyof EventMap]?: Set<EventMap[K]> } = {};
export const emit = <K extends keyof EventMap>(event: K) =>
  listeners[event]?.forEach((fn) => fn());
export const on = <K extends keyof EventMap>(event: K, fn: EventMap[K]) => {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event]!.add(fn);
  return () => listeners[event]?.delete(fn);
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [fonts.bold]: require("../../assets/fonts/Montserrat-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Or render a loading spinner
  }
  return (
    <Stack
      screenOptions={{
        // Global header styles (applies to all screens)
        headerStyle: {
          backgroundColor: colors.header,
          borderBottomColor: "#1A1B18",
          borderBottomWidth: 1,
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
          headerLeft: () => (
            <Pressable
              onPress={() => emit("menu:open")} // Trigger event
              style={{ paddingLeft: 16 }}
            >
              <Ionicons name="menu" size={24} color={colors.text} />
            </Pressable>
          ),
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}

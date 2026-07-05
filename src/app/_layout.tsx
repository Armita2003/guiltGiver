import { colors, fonts, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { Pressable, Text } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
type EventMap = { "menu:open": () => void };
const listeners: { [K in keyof EventMap]?: Set<EventMap[K]> } = {};
export const emit = <K extends keyof EventMap>(event: K) =>
  listeners[event]?.forEach((fn) => fn());
export const on = <K extends keyof EventMap>(event: K, fn: EventMap[K]) => {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event]!.add(fn);
  return () => {
    listeners[event]?.delete(fn);
  };
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
  return (
    <>
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
            headerTitleAlign: "center", // Center the title

            // ✅ Hamburger menu on the left
            headerLeft: () => (
              <Pressable onPress={() => emit("menu:open")}>
                <Ionicons name="menu" size={24} color={colors.textTertiary} />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable onPress={() => emit("menu:open")}>
                <Ionicons
                  name="settings"
                  size={24}
                  color={colors.textTertiary}
                />
              </Pressable>
            ),
            headerShadowVisible: false,
          }}
        />
      </Stack>
      <Toast config={toastConfig} bottomOffset={90} />
    </>
  );
}

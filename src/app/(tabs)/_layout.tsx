import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.surface,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-meals"
        options={{
          title: "Add Meals",
          tabBarIcon: ({ color, size }) => (
            <Octicons name="diff-added" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: "All Meals",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

import { colors } from "@/styles/global";
import {
  cancelMealReminders,
  requestPermissions,
  scheduleMealReminders,
} from "@/utils/notifications";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

const REMINDERS_KEY = "remindersEnabled";

export default function ReminderToggle() {
  const [enabled, setEnabled] = useState(false);
  const position = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const load = async () => {
      const val = await AsyncStorage.getItem(REMINDERS_KEY);
      setEnabled(val === "true");
    };
    load();
  }, []);

  useEffect(() => {
    Animated.timing(position, {
      toValue: enabled ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [enabled, position]);

  const toggle = async (value: boolean) => {
    setEnabled(value);
    if (value) {
      const granted = await requestPermissions();
      if (!granted) {
        setEnabled(false);
        return;
      }
      await scheduleMealReminders();
    } else {
      await cancelMealReminders();
    }
    await AsyncStorage.setItem(REMINDERS_KEY, value.toString());
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelWrapper}>
        <View style={styles.iconWrapper}>
          <MaterialIcons
            name="notifications-active"
            size={20}
            color={colors.button}
          />
        </View>
        <Text style={styles.label}>Meal Reminders</Text>
      </View>
      <Pressable
        style={[styles.toggle, enabled && styles.toggleEnabled]}
        onPress={() => toggle(!enabled)}
        hitSlop={8}
      >
        <Animated.View
          style={[
            styles.thumb,
            enabled && styles.thumbEnabled,
            {
              transform: [
                {
                  translateX: position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginTop: 8,
  },
  labelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    padding: 3,
    justifyContent: "flex-start",
  },
  toggleEnabled: {
    backgroundColor: colors.button,
    justifyContent: "flex-end",
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  thumbEnabled: {
    backgroundColor: colors.white,
  },
});

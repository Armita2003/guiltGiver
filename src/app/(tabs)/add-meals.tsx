import { colors, globalStyles } from "@/styles/global";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddMealScreen() {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [time, setTime] = useState("");
  const [icon, setIcon] = useState("");

  const handleAddMeal = () => {
    console.log({ name, calories, time, icon });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.secondaryTitle}>LOG YOUR FAILURE</Text>
      <Text style={globalStyles.secondarySubTitle}>
        DON'T LIE TO YOURSELF. WE'LL KNOW.
      </Text>

      <Text style={styles.label}>Meal name</Text>
      <TextInput
        style={styles.input}
        placeholder="ANOTHER PIZZA?"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>CALORIES</Text>
      <TextInput
        style={styles.input}
        placeholder="0"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />

      {/* <View style={styles.row}> */}
      <Text style={styles.label}>TIME</Text>
      <TextInput
        style={styles.input}
        placeholder="time (g)"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={time}
        onChangeText={setTime}
      />
      {/* <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="icon (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={icon}
          onChangeText={setIcon}
        /> */}
      {/* </View> */}

      <TouchableOpacity style={styles.button} onPress={handleAddMeal}>
        <Text style={styles.buttonText}>Add Meal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary, // Matches your secondary text
    marginTop: 18, // Space between label and input
    textTransform: "uppercase", // Optional: makes labels feel more "system-like"
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
    fontSize: 16,
    fontWeight: "bold",
  },
});

import { colors, fonts, globalStyles } from "@/styles/global";
import { Image } from "expo-image";
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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleAddMeal = () => {
    console.log({ name, calories, time, icon, selectedDate });
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
      {/* <Button onPress={() => {}} /> */}

      {/* <View style={styles.row}> */}
      {/* <Text style={styles.label}>TIME</Text>
      <TextInput
        style={styles.input}
        placeholder="time (e.g., 7:30 PM)"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={time}
        onChangeText={setTime}
      /> */}
      {/* <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="icon (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={icon}
          onChangeText={setIcon}
        /> */}
      {/* </View> */}
      {/* <Host matchContents>
        <DatePicker
          title="Select date and time"
          selection={selectedDate}
          displayedComponents={["date", "hourAndMinute"]}
          onDateChange={(date) => {
            setSelectedDate(date);
          }}
        />
      </Host> */}

      <TouchableOpacity
        style={[
          styles.button,
          {
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          },
        ]}
        onPress={handleAddMeal}
      >
        <Text style={styles.buttonText}>ADD TO THE LOG</Text>
        <Image
          source={require("../../../assets/images/AddLogIcon.svg")}
          style={{ width: 20, height: 12 }}
        />
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
    fontSize: 24,
    fontFamily: fonts.bold,
  },
});

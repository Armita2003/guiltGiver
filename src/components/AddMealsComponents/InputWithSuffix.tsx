import { colors } from "@/styles/global";
import { StyleSheet, Text, TextInput, View } from "react-native";

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  suffix: string;
  placeholder: string;
};

export default function InputWithSuffix({
  label,
  value,
  onChangeText,
  suffix,
  placeholder,
}: InputProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputInsideContainer}
          placeholder={placeholder}
          placeholderTextColor="transparent"
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
        />
        {!value && (
          <Text style={styles.customPlaceholder} pointerEvents="none">
            {placeholder}
          </Text>
        )}
        <Text style={styles.suffix}>{suffix}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row", // Puts input and text side-by-side
    alignItems: "center", // Vertically centers them
    backgroundColor: colors.surface, // The background is now on the wrapper
    borderRadius: 10,
    marginTop: 16,
  },
  inputInsideContainer: {
    flex: 1, // 🪄 Forces the input to take all available space
    color: colors.text,
    padding: 16,
    fontSize: 16,
    // Note: No backgroundColor, borderRadius, or marginTop here!
  },
  suffix: {
    color: colors.gridColors.unfilled,
    fontSize: 10,
    fontWeight: "regular",
    paddingRight: 16,
  },
  customPlaceholder: {
    position: "absolute",
    left: 16, // Match the padding of your input
    color: colors.gridColors.unfilled,
    fontSize: 18, // 👈 Now you can change the size!
    fontWeight: "semibold", // 👈 Now you can change the weight!
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary, // Matches your secondary text
    marginTop: 18, // Space between label and input
    textTransform: "uppercase", // Optional: makes labels feel more "system-like"
    letterSpacing: 0.5,
  },
});

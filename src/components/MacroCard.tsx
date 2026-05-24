import { cardStyles, colors } from "@/styles/global";
import { Text, View } from "react-native";
import { Bar } from "react-native-progress";
type MacroCardProps = {
  label: string;
  value: string;
  secondaryValue: string;
  color: string;
  halfWidth?: boolean;
};
export default function MacroCard({
  label,
  value,
  secondaryValue,
  color,
  halfWidth = false,
}: MacroCardProps) {
  const current = parseFloat(value) || 0;
  const max = parseFloat(secondaryValue) || 1; // Avoid division by zero

  // 2. Calculate progress (0.0 to 1.0)
  let progress = current / max;

  // 3. Clamp value between 0 and 1
  if (progress < 0) progress = 0;
  if (progress > 1) progress = 1;

  return (
    <View
      style={[
        cardStyles.card,
        {
          borderLeftColor: color,
          flex: halfWidth ? 1 : undefined,
          width: halfWidth ? undefined : "100%",
        },
      ]}
    >
      <Text style={cardStyles.label}>{label}</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Text style={cardStyles.value}>{value}</Text>
        <Text style={cardStyles.secondaryValue}> / {secondaryValue}</Text>
      </View>
      <Bar
        progress={progress}
        width={null}
        color={color}
        borderWidth={0}
        unfilledColor={colors.gridColors.unfilled}
        borderRadius={3}
        style={{ marginTop: 8 }}
      />
    </View>
  );
}

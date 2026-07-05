import { colors } from "@/styles/global";
import { Text, View } from "react-native";
import { Bar } from "react-native-progress";
import { cardStyles } from "./MacroCard.styles";
type MacroCardProps = {
  label: string;
  unit: string;
  value: string;
  secondaryValue: string;
  color: string;
  halfWidth?: boolean;
};
export default function MacroCard({
  label,
  value,
  secondaryValue,
  unit,
  color,
  halfWidth = false,
}: MacroCardProps) {
  const current = Number(value) || 0;
  const max = Number(secondaryValue) || 0;
  const progress = max > 0 ? Math.min(1, current / max) : 0;

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
        <Text style={cardStyles.secondaryValue}>
          / {secondaryValue}
          {unit}
        </Text>
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

import { colors, globalStyles } from "@/styles/global";
import { ScrollView, Text, View } from "react-native";

export default function MealsScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[globalStyles.container, globalStyles.pageContent]}
      showsVerticalScrollIndicator={false}
      bounces={true}
      overScrollMode="always"
    >
      <View style={{ gap: 16 }}>
        <Text style={globalStyles.title}>All Meals</Text>
        <Text style={globalStyles.secondarySubTitle}>
          Your meals will appear here as you log them.
        </Text>
      </View>
    </ScrollView>
  );
}

import HomeHeader from "@/components/HomeHeader";
import MacroGrid from "@/components/MacroGrid";
import { globalStyles } from "@/styles/global";
import { ScrollView, Text } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Guilt Giver</Text>
      <HomeHeader />
      <MacroGrid />
    </ScrollView>
  );
}

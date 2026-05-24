import { globalStyles } from "@/styles/global";
import { ScrollView, Text } from "react-native";

export default function AddMeals() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Add Meals</Text>
    </ScrollView>
  );
}

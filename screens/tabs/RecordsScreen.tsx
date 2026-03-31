import * as Button from "@/components/buttons/buttonsIndex";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function RecordsScreen() {
  return (
    <SafeAreaView>
      <View>
        <Text>Home</Text>
        <Button.AddButton />
      </View>
    </SafeAreaView>
  );
}

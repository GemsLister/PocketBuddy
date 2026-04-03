import * as Button from "@/components/buttons/buttonsIndex";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { ms } from "react-native-size-matters";

export default function TransactionLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="income"
        options={{
          headerTitle: () => (
            <View>
              <Text
                className="font-nunito-bold text-moss"
                style={{ fontSize: ms(20, 0.5) }}
              >
                Add
              </Text>
            </View>
          ),
          headerTitleAlign: "center",
          headerLeft: () => <Button.CancelButton />,
          headerRight: () => <Button.SaveButton />,
        }}
      />
    </Stack>
  );
}

import * as Buttons from "@/components/buttons/buttonsIndex";
import { Stack } from "expo-router";
import { Text } from "react-native";
import { ms } from "react-native-size-matters";

export default function TransactionLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        // 'fade_from_bottom' feels more premium for category switching
        animation: "ios_from_right",
        animationDuration: 100,
        headerTitle: () => (
          <Text
            className="font-nunito-bold text-moss"
            style={{ fontSize: ms(18, 0.5) }}
          >
            Add
          </Text>
        ),
        headerLeft: () => <Buttons.CancelButton />,
        headerRight: () => <Buttons.SaveButton />,
      }}
    >
      {/* Explicitly defining screens is cleaner for debugging names */}
      <Stack.Screen name="expense" />
      <Stack.Screen name="income" />
      <Stack.Screen name="transfer" />
    </Stack>
  );
}

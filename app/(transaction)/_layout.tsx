import * as Button from "@/components/buttons/buttonsIndex";
import { Stack } from "expo-router";
export default function TransactionLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="income"
        options={({ navigation }) => ({
          title: "",
          headerLeft: () => <Button.CancelButton />,
          headerRight: () => <Button.SaveButton />,
        })}
      />
    </Stack>
  );
}

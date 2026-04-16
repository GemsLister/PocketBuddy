import * as Buttons from "@/components/buttons/buttonsIndex";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { ms } from "react-native-size-matters";

export default function TransactionLayout() {
  return (
    <Stack>
      {[
        { name: "income", title: "Income" },
        { name: "expense", title: "Expense" },
        { name: "transfer", title: "Transfer" },
      ].map((items, index) => (
        <Stack.Screen
          key={index}
          name={items.name}
          options={{
            headerTitle: () => (
              <View>
                <Text
                  className="font-nunito-bold text-moss"
                  style={{ fontSize: ms(18, 0.5) }}
                >
                  {items.title}
                </Text>
              </View>
            ),
            headerLeft: () => <Buttons.CancelButton />,
            headerRight: () => <Buttons.SaveButton />,
          }}
        />
      ))}
    </Stack>
  );
}

import { useState } from "react";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { ms } from "react-native-size-matters";
export default function SegmentedButton() {
  const [value, setValue] = useState("income");
  return (
    <View className="w-full items-center">
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        density="medium"
        theme={{
          colors: {
            secondaryContainer: "#588157", // Your leaf green
            onSecondaryContainer: "white",
          },
          fonts: {
            labelLarge: {
              fontFamily: "Nunito-Bold",
              fontSize: ms(15, 0.5),
            },
          },
        }}
        buttons={[
          {
            value: "expense",
            label: "Expense",
            labelStyle: { padding: ms(10, 0.1) },
          },
          {
            value: "income",
            label: "Income",
            labelStyle: { padding: ms(10, 0.1) },
          },
          {
            value: "transfer",
            label: "Transfer",
            labelStyle: { padding: ms(10, 0.1) },
          },
        ]}
        style={{
          alignItems: "center",
          width: "90%",
          borderRadius: 0,
        }}
      />
    </View>
  );
}

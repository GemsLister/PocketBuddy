import { useState } from "react";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { ms } from "react-native-size-matters";

export default function SegmentedButton() {
  const [value, setValue] = useState("income");
  return (
    <View>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        density="medium"
        theme={{
          colors: {
            secondaryContainer: "#385a41", // Your leaf green
            onSecondaryContainer: "white",
          },
        }}
        buttons={[
          { value: "expense", label: "Expense" },
          { value: "income", label: "Income" },
          { value: "transfer", label: "Transfer" },
        ]}
        style={{
          borderRadius: 10,
          width: ms(200, 0.2),
        }}
      />
    </View>
  );
}

import { Pressable, Text, View } from "react-native";
import { ms } from "react-native-size-matters";

type CalculatorGridProps = {
  onNumberPress: (num: string) => void;
  onOperationPress: (op: string) => void;
  onDecimalPress: () => void;
  onEqualsPress: () => void;
};

const buttons = [
  ["7", "8", "9", "÷"],
  ["4", "5", "6", "×"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
];

export default function CalculatorGrid({
  onNumberPress,
  onOperationPress,
  onDecimalPress,
  onEqualsPress,
}: CalculatorGridProps) {
  return (
    <View style={{ gap: ms(8, 0.3), marginBottom: ms(12, 0.5) }}>
      {buttons.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row" style={{ gap: ms(8, 0.3) }}>
          {row.map((btn, btnIndex) => {
            let bgColor = "bg-beige";
            let textColor = "text-moss";

            if (btn === "=" || ["+", "-", "×", "÷"].includes(btn)) {
              bgColor = "bg-leaf";
              textColor = "text-white";
            }

            return (
              <Pressable
                key={btnIndex}
                onPress={() => {
                  if (btn === "=") {
                    console.log(btn);
                    onEqualsPress();
                  } else if (["+", "-", "×", "÷"].includes(btn)) {
                    console.log(btn);
                    onOperationPress(btn);
                  } else if (btn === ".") onDecimalPress();
                  else {
                    console.log(btn);
                    onNumberPress(btn);
                  }
                }}
                className={`${bgColor} rounded-2xl flex-1 items-center justify-center`}
                style={{ paddingVertical: ms(14, 0.5) }}
              >
                <Text
                  className={`font-nunito-bold ${textColor}`}
                  style={{ fontSize: ms(18, 0.5) }}
                >
                  {btn}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

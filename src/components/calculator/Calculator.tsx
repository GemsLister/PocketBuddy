import { useCalculator } from "@/src/hooks/transaction/useCalculator";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";
import CalculatorGrid from "./CalculatorGrid";

type CalculatorProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
};

export default function Calculator({
  visible,
  onClose,
  onConfirm,
}: CalculatorProps) {
  // useCalculator hook = all the necessary logic for the calculator
  const {
    display,
    handleNumberPress,
    handleDecimal,
    handleOperation,
    handleEquals,
    handleClear,
    handleBackspace,
    handleConfirm,
  } = useCalculator(onConfirm, onClose);

  const buttons = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View
          className="bg-white rounded-3xl p-6"
          style={{ width: "85%", maxWidth: ms(300) }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text
              className="font-nunito-bold text-moss"
              style={{ fontSize: ms(18, 0.5) }}
            >
              Add
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close-outline" size={vs(24)} color="#385a41" />
            </Pressable>
          </View>

          {/* Display */}
          <View
            className="bg-beige rounded-2xl p-4 mb-6 items-end"
            style={{ minHeight: vs(70) }}
          >
            <Text
              className="font-nunito-bold text-moss"
              style={{ fontSize: ms(28, 0.5) }}
            >
              {display}
            </Text>
          </View>

          <CalculatorGrid
            onNumberPress={handleNumberPress}
            onOperationPress={handleOperation}
            onDecimalPress={handleDecimal}
            onEqualsPress={handleEquals}
          />

          {/* Control Buttons */}
          <View
            className="flex-row"
            style={{ gap: ms(8, 0.3), marginBottom: ms(12, 0.5) }}
          >
            <Pressable
              onPress={handleBackspace}
              className="bg-rose-100 flex-1 rounded-2xl items-center justify-center"
              style={{ paddingVertical: ms(12, 0.5) }}
            >
              <Ionicons
                name="backspace-outline"
                size={vs(20)}
                color="#b91c1c"
              />
            </Pressable>
            <Pressable
              onPress={handleClear}
              className="bg-rose-100 flex-1 rounded-2xl items-center"
              style={{ paddingVertical: ms(12, 0.5) }}
            >
              <Text
                className="font-nunito-bold text-red-700"
                style={{ fontSize: ms(14, 0.5) }}
              >
                Clear
              </Text>
            </Pressable>
          </View>

          {/* Confirm Button */}
          <Pressable
            onPress={handleConfirm}
            className="bg-leaf rounded-2xl items-center justify-center"
            style={{ paddingVertical: ms(14, 0.5) }}
          >
            <Text
              className="font-nunito-bold text-white"
              style={{ fontSize: ms(16, 0.5) }}
            >
              Confirm
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";

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
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumberPress = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay("0.");
      setNewNumber(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(result.toString());
      setPreviousValue(result);
    }

    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "×":
        return prev * current;
      case "÷":
        return current === 0 ? 0 : prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
      setNewNumber(true);
    }
  };

  const handleConfirm = () => {
    onConfirm(display);
    handleClear();
    onClose();
  };

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

          {/* Button Grid */}
          <View style={{ gap: ms(8, 0.3), marginBottom: ms(12, 0.5) }}>
            {buttons.map((row, rowIndex) => (
              <View
                key={rowIndex}
                className="flex-row"
                style={{ gap: ms(8, 0.3) }}
              >
                {row.map((btn, btnIndex) => {
                  let bgColor = "bg-beige";
                  let textColor = "text-moss";

                  if (btn === "=") {
                    bgColor = "bg-leaf";
                    textColor = "text-white";
                  } else if (["+", "-", "×", "÷"].includes(btn)) {
                    bgColor = "bg-leaf";
                    textColor = "text-white";
                  }

                  return (
                    <Pressable
                      key={btnIndex}
                      onPress={() => {
                        if (btn === "=") {
                          handleEquals();
                        } else if (["+", "-", "×", "÷"].includes(btn)) {
                          handleOperation(btn);
                        } else if (btn === ".") {
                          handleDecimal();
                        } else {
                          handleNumberPress(btn);
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

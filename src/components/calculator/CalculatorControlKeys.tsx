import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";

type CalculatorControlKeysProps = {
  display: string;
  onConfirm: (value: string) => void;
  onBackspace: () => void;
  onClear: () => void;
};

export default function CalculatorControlKeys({
  display,
  onConfirm,
  onBackspace,
  onClear,
}: CalculatorControlKeysProps) {
  return (
    <View>
      {/* Control Buttons */}
      <View
        className="flex-row"
        style={{ gap: ms(8, 0.3), marginBottom: ms(12, 0.5) }}
      >
        <Pressable
          onPress={() => onBackspace()}
          className="bg-rose-100 flex-1 rounded-2xl items-center justify-center"
          style={{ paddingVertical: ms(12, 0.5) }}
        >
          <Ionicons name="backspace-outline" size={vs(20)} color="#b91c1c" />
        </Pressable>
        <Pressable
          onPress={() => onClear()}
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
        onPress={() => onConfirm(display)}
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
  );
}

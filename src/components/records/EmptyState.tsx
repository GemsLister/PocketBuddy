import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";

type EmptyStateProps = {
  message?: string;
};

export default function EmptyState({
  message = "No transactions yet",
}: EmptyStateProps) {
  return (
    <View
      className="items-center justify-center"
      style={{ paddingVertical: vs(60), gap: vs(12) }}
    >
      <View
        className="bg-cream items-center justify-center"
        style={{
          width: ms(80, 0.5),
          height: ms(80, 0.5),
          borderRadius: ms(40, 0.5),
        }}
      >
        <Ionicons name="receipt-outline" size={ms(40, 0.5)} color="#a0b089" />
      </View>
      <Text
        className="font-nunito-semibold text-beige"
        style={{ fontSize: ms(16, 0.5) }}
      >
        {message}
      </Text>
      <Text
        className="font-nunito text-beige text-center"
        style={{ fontSize: ms(13, 0.5), maxWidth: ms(240, 0.7) }}
      >
        Start tracking your finances by adding your first transaction
      </Text>
    </View>
  );
}

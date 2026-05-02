import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";

type SummaryCardProps = {
  title: string;
  amount: number;
  icon: keyof typeof Ionicons.glyphMap;
  type: "balance" | "income" | "expense";
};

export default function SummaryCard({
  title,
  amount,
  icon,
  type,
}: SummaryCardProps) {
  const getColors = () => {
    switch (type) {
      case "income":
        return { bg: "bg-leaf", text: "text-white" };
      case "expense":
        return { bg: "bg-red-50", text: "text-red-600" };
      default:
        return { bg: "bg-moss", text: "text-white" };
    }
  };

  const colors = getColors();

  return (
    <View
      className={`${colors.bg} flex-1`}
      style={{
        padding: ms(16, 0.5),
        borderRadius: ms(16, 0.3),
        gap: vs(8),
      }}
    >
      <View className="flex-row items-center" style={{ gap: ms(8, 0.5) }}>
        <Ionicons
          name={icon}
          size={ms(20, 0.5)}
          color={type === "expense" ? "#dc2626" : "white"}
        />
        <Text
          className={`${colors.text} font-nunito`}
          style={{ fontSize: ms(12, 0.5) }}
        >
          {title}
        </Text>
      </View>
      <Text
        className={`${colors.text} font-nunito-bold`}
        style={{ fontSize: ms(20, 0.5) }}
      >
        ₱{amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
      </Text>
    </View>
  );
}

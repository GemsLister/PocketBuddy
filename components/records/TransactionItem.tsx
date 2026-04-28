import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { ms, vs } from "react-native-size-matters";

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description?: string;
  date: string; // ISO format
  icon: keyof typeof Ionicons.glyphMap;
};

type TransactionItemProps = {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
};

export default function TransactionItem({
  transaction,
  onPress,
}: TransactionItemProps) {
  const getTypeColor = () => {
    switch (transaction.type) {
      case "income":
        return { bg: "bg-green-50", icon: "#588157", text: "text-leaf" };
      case "expense":
        return { bg: "bg-red-50", icon: "#dc2626", text: "text-red-600" };
      // case "transfer":
      //   return { bg: "bg-blue-50", icon: "#2563eb", text: "text-blue-600" };
    }
  };

  const colors = getTypeColor();
  const sign = transaction.type === "expense" ? "-" : "+";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(transaction)}
      className="flex-row items-center justify-between bg-white"
      style={{
        padding: ms(14, 0.5),
        borderRadius: ms(14, 0.3),
      }}
    >
      {/* Left: Icon + Details */}
      <View className="flex-row items-center" style={{ gap: ms(12, 0.5) }}>
        <View
          className={`${colors.bg} items-center justify-center`}
          style={{
            width: ms(44, 0.5),
            height: ms(44, 0.5),
            borderRadius: ms(22, 0.5),
          }}
        >
          <Ionicons
            name={transaction.icon}
            size={ms(22, 0.5)}
            color={colors.icon}
          />
        </View>

        <View style={{ gap: vs(2) }}>
          <Text
            className="font-nunito-semibold text-moss"
            style={{ fontSize: ms(15, 0.5) }}
          >
            {transaction.category}
          </Text>
          {transaction.description && (
            <Text
              className="font-nunito text-beige"
              style={{ fontSize: ms(12, 0.5) }}
              numberOfLines={1}
            >
              {transaction.description}
            </Text>
          )}
        </View>
      </View>

      {/* Right: Amount */}
      <Text
        className={`font-nunito-bold ${colors.text}`}
        style={{ fontSize: ms(16, 0.5) }}
      >
        {sign}₱{transaction.amount.toLocaleString("en-PH")}
      </Text>
    </TouchableOpacity>
  );
}

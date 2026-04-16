import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";

export default function TransactionButton() {
  const [clicked, setClicked] = useState(false);
  const transactionIcons = [
    {
      icon: <Ionicons name="receipt-outline" size={ms(35, 0.5)} />,
      path: "/(transaction)/expense",
      name: "Expense",
    },
    {
      icon: <Ionicons name="cash-outline" size={ms(35, 0.5)} />,
      path: "/(transaction)/income",
      name: "Income",
    },
    {
      icon: <Ionicons name="card-outline" size={ms(35, 0.5)} />,
      path: "/(transaction)/transfer",
      name: "Transfer",
    },
  ];
  return (
    <View className="gap-4 flex-row justify-center">
      {transactionIcons.map((icons, index) => (
        <Link href={icons.path as any} asChild key={index}>
          <TouchableOpacity
            // className=`$(border-[1.5px] border-moss rounded-lg justify-center items-center`
            className={`${!clicked ? "border border-moss bg-white" : "bg-leaf"} rounded-lg justify-center items-center`}
            style={{ padding: ms(25, 0.5) }}
            onPressIn={() => setClicked(true)}
            onPressOut={() => setClicked(false)}
          >
            {icons.icon}
            {/* className="font-nunito-semibold text-moss" */}
            <Text
              className={`${!clicked ? "text-moss" : "text-white"} font-nunito-bold`}
              style={{ fontSize: ms(14, 0.5) }}
            >
              {icons.name}
            </Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
}

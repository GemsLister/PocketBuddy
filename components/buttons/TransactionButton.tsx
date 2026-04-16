import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";

export default function TransactionButton() {
  const pathName = usePathname();

  const transactionIcons = [
    {
      icon: "receipt-outline",
      path: "/(transaction)/expense",
      name: "Expense",
    },
    {
      icon: "cash-outline",
      path: "/(transaction)/income",
      name: "Income",
    },
    {
      icon: "card-outline",
      path: "/(transaction)/transfer",
      name: "Transfer",
    },
  ];

  return (
    <View className="gap-4 flex-row justify-center">
      {transactionIcons.map((item, index) => {
        const isActive = pathName.endsWith(item.name.toLowerCase());

        return (
          <Link href={item.path as any} asChild key={index}>
            <TouchableOpacity
              className={`${
                isActive ? "bg-leaf" : "bg-white border border-moss"
              } rounded-3xl justify-center items-center`}
              style={{ padding: ms(25, 0.5) }}
            >
              <Ionicons
                name={item.icon as any}
                size={ms(40, 0.5)}
                color={isActive ? "white" : "#4A5D4E"}
              />
              <Text
                className={`${isActive ? "text-white" : "text-moss"} font-nunito-semibold`}
                style={{ fontSize: ms(14, 0.5) }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}

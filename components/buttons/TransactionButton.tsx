import { Ionicons } from "@expo/vector-icons";
import { Href, Link, usePathname } from "expo-router";
import { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { ms } from "react-native-size-matters";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type TransactionItem = {
  name: string;
  icon: IoniconsName;
  path: Href;
};

export default function TransactionButton() {
  const pathName = usePathname();

  const transactionIcons: TransactionItem[] = [
    {
      icon: "receipt-outline",
      path: "/(transaction)/expense",
      name: "Expense",
    },
    {
      icon: "bag-outline",
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
        const isActive = pathName.includes(item.name.toLowerCase());

        return (
          <Link href={item.path} asChild key={index}>
            <Pressable
              className={`${isActive ? "bg-leaf" : "bg-white border border-moss"} rounded-3xl justify-center items-center active:bg-leaf`}
              style={{ padding: ms(25, 0.5) }}
            >
              {({ pressed }) => {
                const iconAndTextColor =
                  pressed || isActive ? "white" : "#385a41";
                return (
                  <>
                    <Ionicons
                      name={item.icon}
                      size={ms(40, 0.5)}
                      color={iconAndTextColor}
                    />
                    <Text
                      className="font-nunito-semibold"
                      style={{
                        fontSize: ms(14, 0.5),
                        color: iconAndTextColor,
                      }}
                    >
                      {item.name}
                    </Text>
                  </>
                );
              }}
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

import { Href, Link, usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { ms } from "react-native-size-matters";

// type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type TransactionItem = {
  name: string;
  // icon: IoniconsName;
  path: Href;
};

export default function TransactionButton() {
  const pathName = usePathname();

  const transactionIcons: TransactionItem[] = [
    {
      path: "/(transaction)/expense",
      name: "Expense",
    },
    {
      path: "/(transaction)/income",
      name: "Income",
    },
    {
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
              style={{ padding: ms(8, 0.5), width: ms(100, 0.7) }}
            >
              {({ pressed }) => {
                const iconAndTextColor =
                  pressed || isActive ? "white" : "#385a41";
                return (
                  <>
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

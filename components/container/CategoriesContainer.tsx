import * as Buttons from "@/components/buttons/buttonsIndex";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { ms, vs } from "react-native-size-matters";
type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type CategoryItem = {
  name: string;
  icon: IoniconsName | ReactNode;
};

type CategoriesProps = {
  icons: CategoryItem[];
  view: string;
};

export default function CategoriesContainer({ icons, view }: CategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  return (
    <View
      style={{
        paddingVertical: ms(17, 0.5),
        paddingHorizontal: ms(15, 0.5),
        gap: ms(10, 0.3),
      }}
    >
      <Text
        className="font-nunito-bold text-moss"
        style={{ fontSize: ms(20, 0.5) }}
      >
        Categories
      </Text>

      <View
        className="flex-row flex-wrap items-center rounded-3xl"
        style={{ gap: ms(20, 0.8) }}
      >
        {icons.map((item, index) => {
          const isSelected = selectedCategory === item.name;
          return (
            <Pressable
              key={index}
              onPress={() => {
                setSelectedCategory(item.name);
                setAmount("");
                setNote("");
              }}
              className={`rounded-3xl justify-center gap-3 ${isSelected ? "bg-leaf" : "bg-beige"}`}
              style={{
                width: ms(100, 0.2),
                aspectRatio: 1,
              }}
            >
              <View
                className="items-center justify-center"
                style={{ transform: [{ scale: 1 }] }}
              >
                <View className="bg-beige p-3 rounded-full">
                  {typeof item.icon === "string" ? (
                    <Ionicons
                      name={item.icon as IoniconsName}
                      size={ms(25, 0.5)}
                      color={isSelected ? "#ffffff" : "#385a41"}
                    />
                  ) : (
                    item.icon
                  )}
                </View>

                <Text
                  className={`font-nunito-bold ${isSelected ? "text-white" : "text-moss"}`}
                  style={{ fontSize: vs(10) }}
                >
                  {item.name}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {selectedCategory && (
        <View style={{ gap: ms(12, 0.5), marginTop: vs(10) }}>
          <View className="flex-row justify-between">
            <Text
              className="font-nunito-bold text-moss"
              style={{ fontSize: vs(15) }}
            >
              {selectedCategory}
            </Text>
            <Pressable
              onPress={() => {
                setSelectedCategory(null);
                setAmount("");
                setNote("");
              }}
            >
              <Ionicons name="close-outline" size={vs(20)} color={"#385a41"} />
            </Pressable>
          </View>

          {[
            {
              text: "Amount",
              onChange: setAmount,
            },
            {
              text: "Note (Optional)",
              onChange: setNote,
            },
          ].map((items, index) => (
            <TextInput
              key={index}
              className="font-nunito text-moss border border-slate-400"
              style={{
                fontSize: ms(16, 0.5),
                borderRadius: ms(13, 0.3),
                paddingVertical: ms(10, 0.5),
                paddingHorizontal: ms(14, 0.5),
              }}
              placeholder={items.text}
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={items.onChange}
            />
          ))}
          <Buttons.PrimaryButton text="Ok" link={"/"} />
        </View>
      )}
    </View>
  );
}

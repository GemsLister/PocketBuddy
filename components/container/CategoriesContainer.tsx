import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { ms } from "react-native-size-matters";
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
        gap: ms(20, 0.3),
      }}
    >
      <Text
        className="font-nunito-bold text-moss"
        style={{ fontSize: ms(25, 0.5) }}
      >
        Categories
      </Text>

      <View className="flex-row flex-wrap" style={{ gap: ms(15, 0.6) }}>
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
              className={`flex items-center justify-center gap-3 rounded-3xl border ${isSelected ? "bg-moss border-moss" : "bg-moss/10 border-moss/20 active:bg-moss/20"}`}
              style={{
                height: ms(100, 0.7),
                width: ms(100, 0.7),
                padding: ms(8, 0.5),
              }}
            >
              {typeof item.icon === "string" ? (
                <Ionicons
                  name={item.icon as IoniconsName}
                  size={ms(35, 0.5)}
                  color={isSelected ? "#ffffff" : "#385a41"}
                />
              ) : (
                item.icon
              )}
              <Text
                className={`font-nunito-semibold ${isSelected ? "text-white" : "text-moss"}`}
                style={{ fontSize: ms(15, 0.7) }}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedCategory && (
        <View style={{ gap: ms(12, 0.5) }}>
          <Text
            className="font-nunito-bold text-moss"
            style={{ fontSize: ms(18, 0.5) }}
          >
            {selectedCategory}
          </Text>

          <TextInput
            className="font-nunito text-moss border border-slate-400"
            style={{
              fontSize: ms(16, 0.5),
              borderRadius: ms(13, 0.3),
              paddingVertical: ms(10, 0.5),
              paddingHorizontal: ms(14, 0.5),
            }}
            placeholder="Amount"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <TextInput
            className="font-nunito text-moss border border-slate-400"
            style={{
              fontSize: ms(16, 0.5),
              borderRadius: ms(13, 0.3),
              paddingVertical: ms(10, 0.5),
              paddingHorizontal: ms(14, 0.5),
            }}
            placeholder="Note (optional)"
            placeholderTextColor="#94a3b8"
            value={note}
            onChangeText={setNote}
          />
        </View>
      )}
    </View>
  );
}

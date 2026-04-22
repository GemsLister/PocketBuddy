import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { ms } from "react-native-size-matters";
type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type CategoriesProps = {
  icons: { name: string; icon: IoniconsName }[];
  view: string;
};

export default function CategoriesContainer({ icons, view }: CategoriesProps) {
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
        {icons.map((items, index) => (
          <Pressable
            key={index}
            className="flex items-center justify-center gap-3 bg-moss/10 active:bg-moss/20 rounded-3xl border border-moss/20"
            style={{
              height: ms(100, 0.7),
              width: ms(100, 0.7),
              padding: ms(8, 0.5),
            }}
          >
            <Ionicons name={items.icon} size={ms(35, 0.5)} color="#385a41" />
            <Text
              className="font-nunito-semibold text-moss"
              style={{ fontSize: ms(15, 0.7) }}
            >
              {items.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

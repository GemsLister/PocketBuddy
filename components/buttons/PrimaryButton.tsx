import { Href, Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";
type PrimaryButtonProps = {
  text: string;
  link: Href;
};

export default function PrimaryButton({ text, link }: PrimaryButtonProps) {
  return (
    <View>
      <Link href={link} asChild>
        <TouchableOpacity
          className="bg-moss items-center"
          activeOpacity={0.7}
          style={{ padding: ms(10, 0.5), borderRadius: ms(15, 0.3) }}
        >
          <View>
            <Text
              className="text-white font-nunito-bold"
              style={{ fontSize: ms(18, 0.5) }}
            >
              {text}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

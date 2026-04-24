import { Href, Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";

type SecondaryButtonProps = {
  text: string;
  link: Href;
};
export default function SecondaryButton({ text, link }: SecondaryButtonProps) {
  return (
    <View>
      <Link href={link} asChild>
        <TouchableOpacity
          className="flex-row justify-center items-center border border-leaf"
          activeOpacity={0.7}
          style={{
            padding: ms(10, 0.5),
            borderRadius: ms(15, 0.3),
            gap: ms(5, 0.3),
          }}
        >
          <View>
            <Text
              className="text-moss font-nunito-semibold"
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

import { Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";
type PrimaryButtonProps = {
  text: string;
  onPress: () => void;
};

export default function PrimaryButton({ text, onPress }: PrimaryButtonProps) {
  return (
    <View>
      {/* <Link href={link} asChild> */}
      <TouchableOpacity
        className="bg-moss items-center"
        activeOpacity={0.7}
        style={{ padding: ms(10, 0.5), borderRadius: ms(15, 0.3) }}
        onPress={onPress}
      >
        <View>
          <Text
            className="text-white font-nunito-semibold"
            style={{ fontSize: ms(18, 0.5) }}
          >
            {text}
          </Text>
        </View>
      </TouchableOpacity>
      {/* </Link> */}
    </View>
  );
}

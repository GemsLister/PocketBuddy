import { Image, Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";

export default function GoogleButton() {
  return (
    <View>
      <TouchableOpacity
        className="flex-row justify-center items-center border-[1.5px] border-leaf"
        activeOpacity={0.7}
        style={{
          padding: ms(10, 0.5),
          borderRadius: ms(15, 0.3),
          gap: ms(5, 0.3),
        }}
      >
        <Image
          source={require("@/assets/images/google.png")}
          style={{ height: ms(20, 0.5), width: ms(20, 0.5) }}
        />
        <View>
          <Text
            className="text-moss font-nunito-semibold"
            style={{ fontSize: ms(18, 0.5) }}
          >
            Continue with Google
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

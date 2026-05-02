import { handleGoogleLogin } from "@/src/services/googleAuth";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { ms } from "react-native-size-matters";
export default function GoogleButton() {
  const router = useRouter();
  return (
    <View>
      <Pressable
        className="flex-row justify-center items-center border border-leaf"
        style={{
          padding: ms(10, 0.5),
          borderRadius: ms(15, 0.3),
          gap: ms(5, 0.3),
        }}
        onPress={() => handleGoogleLogin(router)}
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
      </Pressable>
    </View>
  );
}

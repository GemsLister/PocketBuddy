import GoogleButton from "@/components/buttons/GoogleButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import TextInputs from "@/components/inputs/TextInputs";
import { Link } from "expo-router";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms, vs } from "react-native-size-matters";
export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 justify-around items-center">
      <KeyboardAvoidingView
        enabled={true}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <View>
          <View className="items-center">
            <View className="flex-row">
              <View>
                <Text
                  className="font-nunito-bold text-leaf"
                  style={{ fontSize: ms(50, 0.1) }}
                >
                  Pocket
                </Text>
              </View>
              <View>
                <Text
                  className="font-nunito-bold text-moss"
                  style={{ fontSize: ms(50, 0.1) }}
                >
                  Buddy
                </Text>
              </View>
            </View>

            <View className="flex-row gap-1" style={{ marginVertical: vs(10) }}>
              <View>
                <Text
                  className="font-nunito-semibold text-moss"
                  style={{ fontSize: ms(15, 0.5) }}
                >
                  Don't have an account?
                </Text>
              </View>
              {/* Link to registration */}
              <View>
                <Link href={"/(auth)/register"} asChild>
                  <Text
                    className="font-nunito-bold text-moss"
                    style={{ fontSize: ms(15, 0.5) }}
                  >
                    Register
                  </Text>
                </Link>
              </View>
            </View>
          </View>
          {/* Inputs */}
          <View
            className="w-screen"
            style={{
              marginTop: vs(10),
              paddingHorizontal: ms(20, 0.7),
              gap: vs(10),
            }}
          >
            <View style={{ marginBottom: ms(10, 0.8), gap: ms(15, 0.5) }}>
              <GoogleButton />
              <View className="items-center">
                <Text
                  className="font-nunito-semibold text-moss"
                  style={{ fontSize: ms(15, 0.5) }}
                >
                  Or
                </Text>
              </View>
            </View>

            <View style={{ gap: vs(10), paddingBottom: vs(20) }}>
              <TextInputs placeholder="Email" secure={false} />
              <TextInputs placeholder="Password" secure={true} />
              <PrimaryButton text={"Login"} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

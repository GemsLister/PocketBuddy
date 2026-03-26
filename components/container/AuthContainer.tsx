import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms, vs } from "react-native-size-matters";
import PrimaryButton from "../buttons/PrimaryButton";

type AuthContainerProps = {
  children: ReactNode;
  text: string;
};
export default function AuthContainer({ children, text }: AuthContainerProps) {
  return (
    <SafeAreaView
      className="flex-1 justify-between"
      style={{ paddingTop: vs(15 * 3) }}
    >
      <KeyboardAvoidingView
        enabled={true}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <View
          className="w-screen"
          style={{
            marginTop: vs(10),
            paddingHorizontal: ms(20, 0.7),
            gap: vs(10),
          }}
        >
          {children}
        </View>
        <View
          className="w-screen"
          style={{
            marginTop: vs(10),
            paddingHorizontal: ms(20, 0.7),
            gap: vs(10),
          }}
        >
          <PrimaryButton text={text} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

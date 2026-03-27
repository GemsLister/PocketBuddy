import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms, vs } from "react-native-size-matters";
import PrimaryButton from "../buttons/PrimaryButton";

type AuthContainerProps = {
  children: ReactNode;
  text: string;
  screenTitle: string;
};
export default function AuthContainer({
  children,
  text,
  screenTitle,
}: AuthContainerProps) {
  return (
    <SafeAreaView
      className="flex-1 justify-between"
      style={{ paddingTop: vs(15) }}
    >
      <KeyboardAvoidingView
        enabled={true}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <View>
          <Text
            className="font-nunito-bold text-moss"
            style={{ fontSize: ms(23, 0.5) }}
          >
            {screenTitle}
          </Text>
        </View>
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
        ></View>
      </KeyboardAvoidingView>
      <View
        className="w-screen"
        style={{ paddingHorizontal: ms(20, 0.7), paddingBottom: vs(13 * 2) }}
      >
        <PrimaryButton text={text} />
      </View>
    </SafeAreaView>
  );
}

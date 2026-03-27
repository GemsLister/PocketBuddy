import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms, vs } from "react-native-size-matters";
import PrimaryButton from "../buttons/PrimaryButton";

type AuthContainerProps = {
  children: ReactNode;
  label: string;
  text: string;
  screenTitle: string;
};
export default function AuthContainer({
  children,
  label,
  text,
  screenTitle,
}: AuthContainerProps) {
  return (
    <SafeAreaView
      className="flex-1 justify-between"
      style={{ paddingTop: vs(15 * 2.5) }}
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
          <View>
            <Text
              className="font-nunito-bold text-moss"
              style={{ fontSize: ms(33, 0.5) }}
            >
              {screenTitle}
            </Text>
          </View>
          <View>
            <Text
              className="font-nunito-semibold text-moss"
              style={{ fontSize: ms(16, 0.5) }}
            >
              {text}
            </Text>
          </View>
          {children}
          <PrimaryButton text={label} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

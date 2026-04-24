import * as Buttons from "@/components/buttons/buttonsIndex";
import CategoriesContainer from "@/components/container/CategoriesContainer";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { vs } from "react-native-size-matters";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];
type CategoryItem = {
  name: string;
  icon: IoniconsName | ReactNode;
};

type CategoriesProps = {
  icons: CategoryItem[];
};

export default function TransactionScreenContainer({ icons }: CategoriesProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios" || Platform.OS === "android" ? vs(150) : 0
        }
        style={{ flex: 1 }}
      >
        <ScrollView
          className="h-screen"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Buttons.TransactionButton />
          <CategoriesContainer icons={icons} view="" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import * as Icons from "@/assets/icons/iconsIndex";
import * as Buttons from "@/components/buttons/buttonsIndex";
import CategoriesContainer from "@/components/container/CategoriesContainer";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];
type TransferIcon = {
  name: string;
  icon: IoniconsName | ReactNode;
};

export default function TransferScreen() {
  const transferIcons: TransferIcon[] = [
    {
      name: "Savings",
      icon: <Icons.SavingsIcon />,
    },
    {
      name: "Investment",
      icon: <Icons.InvestmentIcon />,
    },
    {
      name: "Credit Card",
      icon: "card-outline",
    },
    {
      name: "Family",
      icon: "people-outline",
    },
    {
      name: "Emergency",
      icon: "shield-checkmark-outline",
    },
    {
      name: "Others",
      icon: "add-outline",
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Buttons.TransactionButton />
          <CategoriesContainer icons={transferIcons} view="Transfer" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

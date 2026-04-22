import * as Buttons from "@/components/buttons/buttonsIndex";
import CategoriesContainer from "@/components/container/CategoriesContainer";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

export default function IncomeScreen() {
  const incomeIcons: { name: string; icon: IoniconsName }[] = [
    {
      name: "Salary",
      icon: "cash-outline",
    },
    {
      name: "Freelance",
      icon: "briefcase-outline",
    },
    {
      name: "Business",
      icon: "trending-up-outline",
    },
    {
      name: "Allowance",
      icon: "wallet-outline",
    },
    {
      name: "Gifts",
      icon: "gift-outline",
    },
    {
      name: "Others",
      icon: "add-outline",
    },
  ];
  return (
    <SafeAreaView>
      <Buttons.TransactionButton />
      {/* Categories */}
      <CategoriesContainer icons={incomeIcons} view="Income" />
    </SafeAreaView>
  );
}

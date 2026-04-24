import * as Icons from "@/assets/icons/iconsIndex";
import * as Buttons from "@/components/buttons/buttonsIndex";
import CategoriesContainer from "@/components/container/CategoriesContainer";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode } from "react";
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
    <SafeAreaView>
      <Buttons.TransactionButton />
      {/* Categories */}
      <CategoriesContainer icons={transferIcons} view="Transfer" />
    </SafeAreaView>
  );
}

import TransactionScreenContainer from "@/components/container/TransactionScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

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
    // {
    //   name: "Allowance",
    //   icon: "wallet-outline",
    // },
    // {
    //   name: "Gifts",
    //   icon: "gift-outline",
    // },
    {
      name: "Other",
      icon: "ellipsis-horizontal-outline",
    },
  ];
  return <TransactionScreenContainer icons={incomeIcons} />;
}

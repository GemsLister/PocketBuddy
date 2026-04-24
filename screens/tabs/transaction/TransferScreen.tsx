import * as Icons from "@/assets/icons/iconsIndex";
import TransactionScreenContainer from "@/components/container/TransactionScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode } from "react";

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
      name: "Bank Card",
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
      name: "Digital Wallet",
      icon: "phone-portrait-outline",
    },
    // {
    //   name: "Others",
    //   icon: "add-outline",
    // },
  ];
  return <TransactionScreenContainer icons={transferIcons} />;
}

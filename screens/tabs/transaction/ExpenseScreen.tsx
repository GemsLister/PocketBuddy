import TransactionScreenContainer from "@/components/container/TransactionScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

export default function ExpenseScreen() {
  const expenseIcons: { name: string; icon: IoniconsName }[] = [
    {
      name: "Foods",
      icon: "fast-food-outline",
    },
    {
      name: "Transport",
      icon: "bus-outline",
    },
    {
      name: "Bills",
      icon: "water-outline",
    },
    {
      name: "Shopping",
      icon: "cart-outline",
    },
    {
      name: "Health",
      icon: "medkit-outline",
    },
    {
      name: "Self-Care",
      icon: "body-outline",
    },
  ];
  return <TransactionScreenContainer icons={expenseIcons} />;
}

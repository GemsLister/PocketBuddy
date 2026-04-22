import * as Buttons from "@/components/buttons/buttonsIndex";
import CategoriesContainer from "@/components/container/CategoriesContainer";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

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
      name: "Home-Bills",
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
  return (
    <SafeAreaView>
      <Buttons.TransactionButton />
      <CategoriesContainer icons={expenseIcons} view="Expenses" />
    </SafeAreaView>
  );
}

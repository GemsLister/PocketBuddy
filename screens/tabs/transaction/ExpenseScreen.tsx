import * as Buttons from "@/components/buttons/buttonsIndex";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ExpenseScreen() {
  return (
    <SafeAreaView>
      <Buttons.TransactionButton />
    </SafeAreaView>
  );
}

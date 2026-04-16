import * as Buttons from "@/components/buttons/buttonsIndex";
import { SafeAreaView } from "react-native-safe-area-context";
export default function TransferScreen() {
  return (
    <SafeAreaView>
      <Buttons.TransactionButton />
    </SafeAreaView>
  );
}

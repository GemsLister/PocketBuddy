// import SegmentedButton from "@/components/buttons/SegmentedButtons";
import * as Buttons from "@/components/buttons/buttonsIndex";
import { SafeAreaView } from "react-native-safe-area-context";
export default function IncomeScreen() {
  return (
    <SafeAreaView>
      <Buttons.TransactionButton />
    </SafeAreaView>
  );
}

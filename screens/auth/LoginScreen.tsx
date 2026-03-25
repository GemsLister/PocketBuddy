import PrimaryButton from "@/components/buttons/PrimaryButton";
import TextInputs from "@/components/inputs/TextInputs";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms } from "react-native-size-matters";
export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View>
        <View>
          <Text
            className="font-nunito-bold text-leaf"
            style={{ fontSize: ms(40, 0.5) }}
          >
            PocketBuddy
          </Text>
        </View>
        {/* Inputs */}
        <View>
          <TextInputs placeholder="Email" secure={false} />
          <TextInputs placeholder="Password" secure={true} />
          <PrimaryButton text={"Login"} />
        </View>
      </View>
    </SafeAreaView>
  );
}

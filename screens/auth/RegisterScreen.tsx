import AuthContainer from "@/components/container/AuthContainer";
import TextInputs from "@/components/inputs/TextInputs";
import { View } from "react-native";
import { vs } from "react-native-size-matters";
export default function RegisterScreen() {
  return (
    <AuthContainer
      text="Create Account"
      screenTitle="Enter Your Personal Details"
    >
      <View style={{ gap: vs(10) }}>
        <TextInputs placeholder="Name" secure={false} />
        <TextInputs placeholder="Email" secure={false} />
        <TextInputs placeholder="Password" secure={true} />
      </View>
    </AuthContainer>
  );
}

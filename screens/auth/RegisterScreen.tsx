import PrimaryButton from "@/components/buttons/PrimaryButton";
import AuthContainer from "@/components/container/AuthContainer";
import TextInputs from "@/components/inputs/TextInputs";
import { useSignUp } from "@/hooks/auth/useSignUp";
import { useState } from "react";
import { View } from "react-native";
import { vs } from "react-native-size-matters";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignUp } = useSignUp();
  return (
    <AuthContainer
      label="Create Account"
      screenTitle="Let's Get Started!"
      text="Enter your personal details"
      link={"/"}
    >
      <View style={{ gap: vs(10) }}>
        {/* <TextInputs placeholder="Name" secure={false} /> */}
        <TextInputs
          placeholder="Email"
          secure={false}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInputs
          placeholder="Password"
          secure={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <PrimaryButton
          text="Register"
          onPress={() => handleSignUp(email, password)}
        />
      </View>
    </AuthContainer>
  );
}

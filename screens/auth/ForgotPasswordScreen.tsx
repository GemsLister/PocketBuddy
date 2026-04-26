import AuthContainer from "@/components/container/AuthContainer";
import TextInputs from "@/components/inputs/TextInputs";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { useState } from "react";
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const { handleForgotPassword } = useForgotPassword();
  return (
    <AuthContainer
      label="Continue"
      screenTitle="Recover your account"
      text="Enter your email address"
      onPress={() => handleForgotPassword(email)}
    >
      <TextInputs
        placeholder="Email"
        secure={false}
        value={email}
        onChangeText={setEmail}
      />
    </AuthContainer>
  );
}

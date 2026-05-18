import AuthContainer from "@/src/components/container/AuthContainer";
import TextInputs from "@/src/components/inputs/TextInputs";
import { useSignUp } from "@/src/hooks/auth/useSignUp";
import { useState } from "react";
import { View } from "react-native";
import { vs } from "react-native-size-matters";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignUp, loading, error, success } = useSignUp();
  return (
    <AuthContainer
      label="Create Account"
      screenTitle="Let's Get Started!"
      text="Enter your personal details"
      onPress={() => handleSignUp(username, email, password)}
      loading={loading}
    >
      <View style={{ gap: vs(10) }}>
        <TextInputs
          placeholder="Username"
          secure={false}
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
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
      </View>
    </AuthContainer>
  );
}

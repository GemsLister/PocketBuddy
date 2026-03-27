import AuthContainer from "@/components/container/AuthContainer";
import TextInputs from "@/components/inputs/TextInputs";
export default function ForgotPasswordScreen() {
  return (
    <AuthContainer
      label="Continue"
      screenTitle="Recover your account"
      text="Enter your email address"
      link={"/"}
    >
      <TextInputs placeholder="Email" secure={false} />
    </AuthContainer>
  );
}

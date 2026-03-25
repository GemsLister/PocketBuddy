import { TextInput, View } from "react-native";

type TextInputsProps = {
  placeholder: string;
  secure: boolean;
};

export default function TextInputs({ placeholder, secure }: TextInputsProps) {
  return (
    <View>
      <TextInput placeholder={placeholder} secureTextEntry={secure} />
    </View>
  );
}

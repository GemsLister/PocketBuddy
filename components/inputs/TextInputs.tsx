import { TextInput, View } from "react-native";
import { ms } from "react-native-size-matters";
type TextInputsProps = {
  placeholder: string;
  secure: boolean;
};

export default function TextInputs({ placeholder, secure }: TextInputsProps) {
  return (
    <View>
      <TextInput
        className="font-nunito border border-slate-400"
        style={{
          fontSize: ms(15, 0.5),
          padding: ms(10, 0.5),
          borderRadius: ms(15, 0.3),
        }}
        placeholder={placeholder}
        secureTextEntry={secure}
      />
    </View>
  );
}

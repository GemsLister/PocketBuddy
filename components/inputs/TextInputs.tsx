import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { ms } from "react-native-size-matters";
type TextInputsProps = {
  placeholder: string;
  secure: boolean;
};

export default function TextInputs({ placeholder, secure }: TextInputsProps) {
  return (
    <View>
      <TextInput
        mode="outlined"
        className="font-nunito"
        style={{
          fontSize: ms(15, 0.5),
          borderRadius: ms(15, 0.3),
        }}
        label={placeholder}
        secureTextEntry={secure}
        outlineStyle={{
          borderRadius: ms(13, 0.3),
          borderWidth: 1, // Keeps the border thin
        }}
        outlineColor="#94a3b8" // slate-400 (Inactive color)
        activeOutlineColor="#94a3b8"
      />
    </View>
  );
}

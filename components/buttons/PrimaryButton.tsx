import { Text, TouchableOpacity, View } from "react-native";

type PrimaryButtonProps = {
  text: string;
};

export default function PrimaryButton({ text }: PrimaryButtonProps) {
  return (
    <View>
      <TouchableOpacity className="bg-moss" activeOpacity={0.7}>
        <View>
          <Text>{text}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

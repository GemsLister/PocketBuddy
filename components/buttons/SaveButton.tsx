import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";

export default function CancelButton() {
  return (
    <View className="flex-row flex-1 justify-between">
      <Link href="../" asChild>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons
            name="checkmark-circle"
            size={ms(24, 0.5)}
            color={"#385a41"}
          />
          <View>
            <Text
              className="font-nunito-bold text-moss"
              style={{ fontSize: ms(16, 0.5) }}
            >
              Save
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

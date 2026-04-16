import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";

export default function SaveButton() {
  return (
    <View className="flex-row items-center pr-3">
      <Link href={"/(tabs)/records"} asChild>
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

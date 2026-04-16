import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";
export default function SaveButton() {
  return (
    <View>
      <TouchableOpacity className="flex-row items-center">
        <Link href={"/(tabs)/records"}>
          <Ionicons
            name="chevron-back-outline"
            size={ms(24, 0.5)}
            color="#385a41"
          />
        </Link>
      </TouchableOpacity>
    </View>
  );
}

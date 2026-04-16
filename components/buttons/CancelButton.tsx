import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";
export default function SaveButton() {
  const router = useRouter();
  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => router.back()}
      >
        <Ionicons
          name="chevron-back-outline"
          size={ms(24, 0.5)}
          color="#385a41"
        />
      </TouchableOpacity>
    </View>
  );
}

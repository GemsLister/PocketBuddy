import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ms } from "react-native-size-matters";

export default function AddButton() {
  return (
    <Link href={"/"} asChild>
      <TouchableOpacity>
        <Ionicons name="add-outline" size={ms(24, 0.5)} />
      </TouchableOpacity>
    </Link>
  );
}

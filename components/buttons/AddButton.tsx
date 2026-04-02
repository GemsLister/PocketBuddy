import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ms } from "react-native-size-matters";

export default function AddButton() {
  return (
    <Link href={"/(screens)/add"} asChild>
      <TouchableOpacity
        className="rounded-[50] bg-leaf"
        style={{ padding: ms(5, 0.5) }}
      >
        <Ionicons name="add-outline" size={ms(30, 0.5)} color={"white"} />
      </TouchableOpacity>
    </Link>
  );
}

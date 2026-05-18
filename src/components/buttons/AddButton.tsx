import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ms } from "react-native-size-matters";

export default function AddButton() {
  return (
    <Link href={"/(transaction)/income"} asChild>
      <TouchableOpacity
        className="bg-moss justify-center items-center shadow-md shadow-black rounded-[50]"
        style={{ padding: ms(5, 0.5) }}
      >
        <Ionicons name="add-outline" size={ms(30, 0.5)} color={"white"} />
      </TouchableOpacity>
    </Link>
  );
}

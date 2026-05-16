import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ms, vs } from "react-native-size-matters";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View
      className="flex-row items-end bg-white"
      style={{
        paddingHorizontal: ms(12, 0.5),
        paddingVertical: vs(8),
        gap: ms(8, 0.5),
        borderTopWidth: 1,
        borderTopColor: "#dcd8cc",
      }}
    >
      {/* Text input */}
      <View
        className="flex-1 bg-cream/30"
        style={{
          borderRadius: ms(20, 0.3),
          paddingHorizontal: ms(16, 0.5),
          paddingVertical: Platform.OS === "ios" ? vs(10) : vs(4),
          maxHeight: vs(120),
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Ask PocketBuddy..."
          placeholderTextColor="#a0b089"
          multiline
          editable={!disabled}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          style={{
            fontFamily: "Nunito-Regular",
            fontSize: ms(14, 0.5),
            color: "#385a41",
            maxHeight: vs(100),
          }}
        />
      </View>

      {/* Send button */}
      <TouchableOpacity
        onPress={handleSend}
        disabled={disabled || !text.trim()}
        activeOpacity={0.7}
        className="bg-moss items-center justify-center"
        style={{
          width: ms(40, 0.5),
          height: ms(40, 0.5),
          borderRadius: ms(20, 0.5),
          opacity: disabled || !text.trim() ? 0.4 : 1,
        }}
      >
        <Ionicons name="send" size={ms(18, 0.5)} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

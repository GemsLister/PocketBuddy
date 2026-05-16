import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";

type ChatBubbleProps = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  isError?: boolean;
  onRetry?: () => void;
};

export default function ChatBubble({
  role,
  content,
  timestamp,
  isError = false,
}: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <View
      className={`flex-row ${isUser ? "justify-end" : "justify-start"}`}
      style={{ marginBottom: vs(8) }}
    >
      {/* AI avatar */}
      {!isUser && (
        <View
          className="bg-beige items-center justify-center"
          style={{
            width: ms(32, 0.5),
            height: ms(32, 0.5),
            borderRadius: ms(16, 0.5),
            marginRight: ms(8, 0.5),
            marginTop: vs(2),
          }}
        >
          <Ionicons name="sparkles" size={ms(16, 0.5)} color="#385a41" />
        </View>
      )}

      {/* Message bubble */}
      <View
        className={isUser ? "bg-moss" : "bg-white"}
        style={{
          maxWidth: "75%",
          paddingHorizontal: ms(14, 0.5),
          paddingVertical: vs(10),
          borderRadius: ms(16, 0.3),
          borderTopRightRadius: isUser ? ms(4, 0.3) : ms(16, 0.3),
          borderTopLeftRadius: isUser ? ms(16, 0.3) : ms(4, 0.3),
          ...(isError && { borderWidth: 1, borderColor: "#dc2626" }),
        }}
      >
        <Text
          className={`font-nunito ${isUser ? "text-white" : "text-moss"}`}
          style={{ fontSize: ms(14, 0.5), lineHeight: ms(20, 0.5) }}
        >
          {content}
        </Text>

        {/* Timestamp */}
        {timestamp && (
          <Text
            className={`font-nunito ${isUser ? "text-white/60" : "text-beige"}`}
            style={{
              fontSize: ms(10, 0.5),
              marginTop: vs(4),
              textAlign: isUser ? "right" : "left",
            }}
          >
            {timestamp}
          </Text>
        )}

        {/* Error indicator */}
        {isError && (
          <View
            className="flex-row items-center"
            style={{ marginTop: vs(4), gap: ms(4, 0.5) }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={ms(12, 0.5)}
              color="#dc2626"
            />
            <Text
              className="font-nunito"
              style={{ fontSize: ms(10, 0.5), color: "#dc2626" }}
            >
              Failed to send. Tap to retry.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

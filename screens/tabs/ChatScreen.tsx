import ChatBubble from "@/src/components/chat/ChatBubble";
import ChatInput from "@/src/components/chat/ChatInput";
import TypingIndicator from "@/src/components/chat/TypingIndicator";
import { useChat } from "@/src/hooks/chat/useChat";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms, vs } from "react-native-size-matters";

// ---------- Welcome card shown when chat is empty ----------
function WelcomeCard({
  onSuggestionPress,
}: {
  onSuggestionPress: (text: string) => void;
}) {
  return (
    <View
      className="items-center justify-center flex-1"
      style={{ paddingHorizontal: ms(30, 0.7), gap: vs(16) }}
    >
      {/* AI avatar */}
      <View
        className="bg-beige items-center justify-center"
        style={{
          width: ms(72, 0.5),
          height: ms(72, 0.5),
          borderRadius: ms(36, 0.5),
        }}
      >
        <Ionicons name="sparkles" size={ms(36, 0.5)} color="#385a41" />
      </View>

      <Text
        className="font-nunito-bold text-moss text-center"
        style={{ fontSize: ms(22, 0.5) }}
      >
        PocketBuddy AI
      </Text>

      <Text
        className="font-nunito text-beige text-center"
        style={{ fontSize: ms(14, 0.5), lineHeight: ms(20, 0.5) }}
      >
        Your personal financial advisor. Ask me anything about your spending,
        savings, or budgeting goals!
      </Text>

      {/* Suggestion chips */}
      <View style={{ gap: vs(8), marginTop: vs(8), width: "100%" }}>
        {[
          "How much did I spend this month?",
          "What's my biggest expense category?",
          "Give me a savings tip",
        ].map((suggestion) => (
          <TouchableOpacity
            key={suggestion}
            activeOpacity={0.7}
            onPress={() => onSuggestionPress(suggestion)}
            className="bg-white"
            style={{
              paddingHorizontal: ms(14, 0.5),
              paddingVertical: vs(10),
              borderRadius: ms(12, 0.3),
              borderWidth: 1,
              borderColor: "#dcd8cc",
            }}
          >
            <Text
              className="font-nunito text-leaf text-center"
              style={{ fontSize: ms(13, 0.5) }}
            >
              {suggestion}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ---------- Main Screen ----------
export default function ChatScreen() {
  const {
    messages,
    isLoading,
    isSending,
    error,
    rateLimitSeconds,
    sendMessage,
    clearChat,
  } = useChat();

  const isRateLimited = rateLimitSeconds !== null && rateLimitSeconds > 0;
  const flatListRef = useRef<FlatList>(null);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView className="flex-1 bg-cream/20">
      {/* Header */}
      <View
        className="flex-row items-center justify-between bg-white"
        style={{
          paddingHorizontal: ms(20, 0.7),
          paddingVertical: vs(12),
          borderBottomWidth: 1,
          borderBottomColor: "#dcd8cc",
        }}
      >
        <View className="flex-row items-center" style={{ gap: ms(10, 0.5) }}>
          <View
            className="bg-beige items-center justify-center"
            style={{
              width: ms(36, 0.5),
              height: ms(36, 0.5),
              borderRadius: ms(18, 0.5),
            }}
          >
            <Ionicons name="sparkles" size={ms(18, 0.5)} color="#385a41" />
          </View>
          <View>
            <Text
              className="font-nunito-bold text-moss"
              style={{ fontSize: ms(16, 0.5) }}
            >
              PocketBuddy AI
            </Text>
            <Text
              className="font-nunito text-beige"
              style={{ fontSize: ms(11, 0.5) }}
            >
              {isSending ? "Typing..." : "Online"}
            </Text>
          </View>
        </View>

        {/* New chat button */}
        <TouchableOpacity
          onPress={clearChat}
          activeOpacity={0.7}
          style={{ padding: ms(8, 0.5) }}
        >
          <Ionicons
            name="create-outline"
            size={ms(22, 0.5)}
            color="#588157"
          />
        </TouchableOpacity>
      </View>

      {/* Chat body */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#588157" />
            <Text
              className="font-nunito text-beige"
              style={{ marginTop: vs(12), fontSize: ms(14, 0.5) }}
            >
              Loading conversation...
            </Text>
          </View>
        ) : messages.length === 0 ? (
          <WelcomeCard onSuggestionPress={sendMessage} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: ms(14, 0.7),
              paddingTop: vs(16),
              paddingBottom: vs(8),
            }}
            renderItem={({ item }) => (
              <ChatBubble
                role={item.role}
                content={item.content}
                timestamp={formatTime(item.created_at)}
                isError={item.isError}
              />
            )}
            ListFooterComponent={isSending ? <TypingIndicator /> : null}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />
        )}

        {/* Rate limit countdown banner */}
        {isRateLimited && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: ms(8, 0.3),
              paddingHorizontal: ms(16, 0.5),
              paddingVertical: vs(10),
              backgroundColor: "#FEF3C7",
              borderTopWidth: 1,
              borderTopColor: "#FDE68A",
            }}
          >
            <Ionicons
              name="time-outline"
              size={ms(16, 0.5)}
              color="#D97706"
            />
            <Text
              className="font-nunito-semibold text-center"
              style={{ fontSize: ms(13, 0.5), color: "#92400E" }}
            >
              Quota reached · Try again in {rateLimitSeconds}s
            </Text>
          </View>
        )}

        {/* Generic error banner (non-rate-limit errors only) */}
        {error && !isRateLimited && (
          <View
            className="bg-red-50"
            style={{
              paddingHorizontal: ms(16, 0.5),
              paddingVertical: vs(8),
            }}
          >
            <Text
              className="font-nunito text-center"
              style={{ fontSize: ms(12, 0.5), color: "#dc2626" }}
            >
              {error}
            </Text>
          </View>
        )}

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          disabled={isSending || isRateLimited}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

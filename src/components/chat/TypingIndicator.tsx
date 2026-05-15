import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";

export default function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 150);
    const a3 = animate(dot3, 300);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  const dotStyle = (dot: Animated.Value) => ({
    width: ms(6, 0.5),
    height: ms(6, 0.5),
    borderRadius: ms(3, 0.5),
    backgroundColor: "#588157",
    opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
  });

  return (
    <View className="flex-row justify-start" style={{ marginBottom: vs(8) }}>
      {/* AI avatar */}
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

      {/* Dots bubble */}
      <View
        className="bg-white flex-row items-center"
        style={{
          paddingHorizontal: ms(16, 0.5),
          paddingVertical: vs(12),
          borderRadius: ms(16, 0.3),
          borderTopLeftRadius: ms(4, 0.3),
          gap: ms(4, 0.5),
        }}
      >
        <Animated.View style={dotStyle(dot1)} />
        <Animated.View style={dotStyle(dot2)} />
        <Animated.View style={dotStyle(dot3)} />

        <Text
          className="font-nunito text-beige"
          style={{ fontSize: ms(11, 0.5), marginLeft: ms(6, 0.5) }}
        >
          Thinking...
        </Text>
      </View>
    </View>
  );
}

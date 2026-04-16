import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ms } from "react-native-size-matters";
export default function AuthRootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("@/assets/fonts/Nunito/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("@/assets/fonts/Nunito/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("@/assets/fonts/Nunito/Nunito-Bold.ttf"),
  });
  if (!fontsLoaded) return null;
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      {["register", "forgotPassword"].map((names) => (
        <Stack.Screen
          name={names}
          options={{
            title: "",
            headerShadowVisible: false,
            headerTransparent: true,
            headerTitleStyle: {
              fontFamily: "Nunito-Bold",
              fontWeight: "bold",
              fontSize: ms(25, 0.7),
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  name="chevron-back-outline"
                  size={ms(28, 0.5)} // This allows you to scale the arrow size
                  color="#385a41" // Specifically sets the arrow color
                />
              </TouchableOpacity>
            ),
          }}
        />
      ))}
    </Stack>
  );
}

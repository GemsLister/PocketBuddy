import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ms } from "react-native-size-matters";
export default function AuthRootLayout() {
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("@/assets/fonts/Nunito/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("@/assets/fonts/Nunito/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("@/assets/fonts/Nunito/Nunito-Bold.ttf"),
  });
  if (!fontsLoaded) return null;
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          headerShadowVisible: false,
          headerTransparent: true,
          headerTitleStyle: {
            fontFamily: "Nunito-Bold",
            fontWeight: "bold",
            fontSize: ms(25, 0.7),
          },
        }}
      />
    </Stack>
  );
}

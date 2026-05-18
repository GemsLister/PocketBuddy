import "@/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import FlashMessage from "react-native-flash-message";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("@/assets/fonts/Nunito/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("@/assets/fonts/Nunito/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("@/assets/fonts/Nunito/Nunito-Bold.ttf"),
  });
  if (!fontsLoaded) return null;
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <FlashMessage position="top" />
    </>
  );
}

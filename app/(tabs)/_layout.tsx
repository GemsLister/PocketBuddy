import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { ms } from "react-native-size-matters";
export default function TabRootLayout() {
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("@/assets/fonts/Nunito/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("@/assets/fonts/Nunito/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("@/assets/fonts/Nunito/Nunito-Bold.ttf"),
  });
  if (!fontsLoaded) return null;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: "Nunito-SemiBold",
          fontSize: ms(12, 0.5),
          color: "#385a41",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={ms(24, 0.5)} color={"#385a41"} />
          ),
        }}
      />
    </Tabs>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { ms } from "react-native-size-matters";

export default function TabRootLayout() {
  const tabs: {
    name: string;
    title: string;
    icon?: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      name: "records",
      title: "Records",
      icon: "newspaper-outline",
    },
    {
      name: "charts",
      title: "Charts",
      icon: "pie-chart-outline",
    },
    {
      name: "profile",
      title: "Profile",
      icon: "person-outline",
    },
  ];

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
      {tabs.map((item, index) => (
        <Tabs.Screen
          key={index}
          name={item.name}
          options={{
            title: item.title,
            tabBarIcon: ({ color }) => (
              <Ionicons name={item.icon} size={ms(24, 0.5)} color="#385a41" />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

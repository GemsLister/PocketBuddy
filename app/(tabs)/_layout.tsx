import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { ms } from "react-native-size-matters";

const ACTIVE_COLOR = "#385a41";
const INACTIVE_COLOR = "#a0b089";

type TabConfig = {
  name: string;
  title: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
};

const tabs: TabConfig[] = [
  {
    name: "records",
    title: "Records",
    iconActive: "newspaper",
    iconInactive: "newspaper-outline",
  },
  {
    name: "charts",
    title: "Insights",
    iconActive: "analytics",
    iconInactive: "analytics-outline",
  },
  {
    name: "chat",
    title: "Chat",
    iconActive: "sparkles",
    iconInactive: "sparkles-outline",
  },
  {
    name: "profile",
    title: "Profile",
    iconActive: "person",
    iconInactive: "person-outline",
  },
];

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
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: {
          fontFamily: "Nunito-SemiBold",
          fontSize: ms(12, 0.5),
        },
      }}
    >
      {tabs.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.title,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? item.iconActive : item.iconInactive}
                size={ms(24, 0.5)}
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
            ),
          }}
        />
      ))}
      <Tabs.Screen
        name="editprofile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

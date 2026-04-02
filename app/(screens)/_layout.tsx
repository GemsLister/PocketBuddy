import { Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";
export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="add"
        options={({ navigation }) => ({
          title: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View>
                <Text
                  className="font-nunito-semibold text-moss"
                  style={{ fontSize: ms(16, 0.5) }}
                >
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack>
  );
}

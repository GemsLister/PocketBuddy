import SecondaryButton from "@/src/components/buttons/SecondaryButton";
import ScreenContainer from "@/src/components/container/ScreenContainer";
import { useProfile } from "@/src/hooks/auth/useProfile";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { ms, vs } from "react-native-size-matters";

// ---------- Types ----------
type UserProfile = {
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
};

type SettingsItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

// ---------- Settings menu definition ----------
const editProfileItem: SettingsItem = {
  id: "edit_profile",
  label: "Edit Profile",
  icon: "create-outline",
};

function AvatarSection({ user }: { user: UserProfile | null }) {
  return (
    <View className="items-center" style={{ gap: vs(12) }}>
      <View
        className="bg-white items-center justify-center"
        style={{
          width: ms(110, 0.5),
          height: ms(110, 0.5),
          borderRadius: ms(55, 0.5),
          borderWidth: 3,
          borderColor: "#588157",
          padding: ms(4, 0.5),
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View
          className="overflow-hidden"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: ms(50, 0.5),
            backgroundColor: "#f0f2f0",
          }}
        >
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View className="items-center justify-center w-full h-full">
              <Ionicons name="person" size={ms(48, 0.5)} color="#385a41" />
            </View>
          )}
        </View>
      </View>

      <View className="items-center" style={{ gap: vs(4) }}>
        <Text
          className="font-nunito-bold text-moss"
          style={{ fontSize: ms(24, 0.5) }}
        >
          {user?.name ?? "—"}
        </Text>

        <Text
          className="font-nunito text-leaf"
          style={{ fontSize: ms(15, 0.5) }}
        >
          {user?.email ?? "—"}
        </Text>
      </View>

      {user?.bio ? (
        <View
          className="bg-white p-4 items-center"
          style={{
            borderRadius: ms(12, 0.3),
            width: "100%",
            marginTop: vs(8),
            borderWidth: 1,
            borderColor: "#f0f0f0",
          }}
        >
          <Text
            className="font-nunito text-moss text-center"
            style={{ fontSize: ms(14, 0.5), lineHeight: vs(20) }}
          >
            {user.bio}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default function ProfileScreen() {
  const { user, loading, error } = useProfile();

  return (
    <ScreenContainer showAddButton={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ms(24, 0.7),
          paddingTop: vs(30),
          paddingBottom: vs(40),
          gap: vs(32),
        }}
      >
        {loading && (
          <View
            className="items-center justify-center"
            style={{ height: vs(300) }}
          >
            <ActivityIndicator size="large" color="#588157" />
          </View>
        )}

        {error && !loading && (
          <View
            className="items-center justify-center bg-red-50 p-4"
            style={{ borderRadius: ms(8, 0.3) }}
          >
            <Text className="font-nunito text-red-600 text-center">
              {error}
            </Text>
          </View>
        )}

        {!loading && !error && (
          <>
            <AvatarSection user={user} />

            <View style={{ gap: vs(12) }}>
              <Link href="/(tabs)/editprofile" asChild>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="bg-leaf flex-row items-center justify-center"
                  style={{
                    paddingVertical: vs(14),
                    borderRadius: ms(14, 0.3),
                    gap: ms(8, 0.5),
                  }}
                >
                  <Ionicons
                    name="create-outline"
                    size={ms(20, 0.5)}
                    color="white"
                  />
                  <Text
                    className="font-nunito-bold text-white"
                    style={{ fontSize: ms(16, 0.5) }}
                  >
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              </Link>

              <SecondaryButton text="Log Out" link="/(auth)/login" />
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

import SecondaryButton from "@/src/components/buttons/SecondaryButton";
import ScreenContainer from "@/src/components/container/ScreenContainer";
import { useProfile } from "@/src/hooks/auth/useProfile";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ms, vs } from "react-native-size-matters";

// ---------- Types (ready for backend integration) ----------
type UserProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type SettingsItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

// ---------- Settings menu definition ----------
const settingsItems: SettingsItem[] = [
  { id: "edit_profile", label: "Edit Profile", icon: "person-outline" },
  { id: "currency", label: "Currency", icon: "cash-outline" },
  {
    id: "notifications",
    label: "Notifications",
    icon: "notifications-outline",
  },
  { id: "data_export", label: "Data Export", icon: "download-outline" },
  { id: "help", label: "Help & Support", icon: "help-circle-outline" },
  { id: "about", label: "About", icon: "information-circle-outline" },
];

// ---------- Sub-components (kept inline, under 150 lines total) ----------

function AvatarSection({ user }: { user: UserProfile | null }) {
  return (
    <View className="items-center" style={{ gap: vs(8) }}>
      {/* Avatar circle */}
      <View
        className="bg-beige items-center justify-center"
        style={{
          width: ms(90, 0.5),
          height: ms(90, 0.5),
          borderRadius: ms(45, 0.5),
        }}
      >
        <Ionicons name="person" size={ms(44, 0.5)} color="#385a41" />
      </View>

      {/* Name */}
      <Text
        className="font-nunito-bold text-moss"
        style={{ fontSize: ms(22, 0.5) }}
      >
        {user?.name ?? "—"}
      </Text>

      {/* Email */}
      <Text className="font-nunito text-leaf" style={{ fontSize: ms(14, 0.5) }}>
        {user?.email ?? "—"}
      </Text>
    </View>
  );
}

function SettingsRow({ item }: { item: SettingsItem }) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={item.onPress}
      className="flex-row items-center justify-between bg-white"
      style={{
        paddingVertical: vs(14),
        paddingHorizontal: ms(18, 0.5),
        borderRadius: ms(14, 0.3),
      }}
    >
      <View className="flex-row items-center" style={{ gap: ms(14, 0.5) }}>
        <Ionicons name={item.icon} size={ms(22, 0.5)} color="#588157" />
        <Text
          className="font-nunito-semibold text-moss"
          style={{ fontSize: ms(16, 0.5) }}
        >
          {item.label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={ms(18, 0.5)} color="#a0b089" />
    </TouchableOpacity>
  );
}

// ---------- Main Screen ----------
export default function ProfileScreen() {
  const { user, loading, error } = useProfile();

  return (
    <ScreenContainer showAddButton={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ms(20, 0.7),
          paddingTop: vs(20),
          paddingBottom: vs(40),
          gap: vs(24),
        }}
      >
        {/* --- Loading State --- */}
        {loading && (
          <View
            className="items-center justify-center"
            style={{ height: vs(300) }}
          >
            <ActivityIndicator size="large" color="#588157" />
          </View>
        )}

        {/* --- Error State --- */}
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

        {/* --- Profile Header --- */}
        {!loading && !error && <AvatarSection user={user} />}

        {/* --- Settings List --- */}
        {!loading && !error && (
          <View style={{ gap: vs(10) }}>
            <Text
              className="font-nunito-bold text-moss"
              style={{ fontSize: ms(14, 0.5), marginLeft: ms(4, 0.3) }}
            >
              Settings
            </Text>
            <View style={{ gap: vs(8) }}>
              {settingsItems.map((item) => (
                <SettingsRow key={item.id} item={item} />
              ))}
            </View>
          </View>
        )}

        {/* --- Logout --- */}
        {!loading && <SecondaryButton text="Log Out" link="/(auth)/login" />}
      </ScrollView>
    </ScreenContainer>
  );
}

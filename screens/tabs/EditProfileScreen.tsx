import ScreenContainer from "@/src/components/container/ScreenContainer";
import TextInputs from "@/src/components/inputs/TextInputs";
import { useChangePassword } from "@/src/hooks/auth/useChangePassword";
import { useProfile } from "@/src/hooks/auth/useProfile";
import { useUpdateProfile } from "@/src/hooks/auth/useUpdateProfile";
import { useUpdateProfileImage } from "@/src/hooks/auth/useUpdateProfileImage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ms, vs } from "react-native-size-matters";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, loading: profileLoading } = useProfile();
  const { updateProfile, updating, error: profileError } = useUpdateProfile();
  const {
    changePassword,
    loading: changingPassword,
    error: passwordError,
  } = useChangePassword();
  const {
    updateProfileImage,
    loading: imageLoading,
    error: imageError,
  } = useUpdateProfileImage();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!profileLoading && user) {
      setUsername(user.name ?? "");
      setBio(user.bio ?? "");
    }
  }, [profileLoading, user]);

  const canSave = useMemo(() => {
    const isUsernameValid = username.trim().length > 0;
    const isPasswordValid =
      newPassword.length === 0 ||
      (newPassword.length >= 6 && newPassword === confirmPassword);
    return (
      isUsernameValid &&
      isPasswordValid &&
      !updating &&
      !changingPassword &&
      !imageLoading
    );
  }, [
    username,
    newPassword,
    confirmPassword,
    updating,
    changingPassword,
    imageLoading,
  ]);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (e: any) {
      console.error("Pick image error:", e);
      Alert.alert(
        "Error",
        "Dili ma-open ang image picker. Siguroha nga gi-rebuild na nimo ang app gamit ang 'npx expo run:android'.",
      );
    }
  };

  const handleSave = async () => {
    if (!canSave) {
      if (newPassword.length > 0) {
        if (newPassword.length < 6) {
          Alert.alert(
            "Password Error",
            "Password must be at least 6 characters.",
          );
          return;
        }
        if (newPassword !== confirmPassword) {
          Alert.alert("Password Error", "Passwords do not match.");
          return;
        }
      }
      return;
    }

    try {
      // 1. Update Profile Image if selected
      if (selectedImage) {
        const imageRes = await updateProfileImage({
          uri: selectedImage,
        });
        if (!imageRes.ok) return;
      }

      // 2. Update Profile Info
      const profileRes = await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        // avatarUrl is handled by updateProfileImage if it was changed.
        // If we pass user?.avatarUrl here, it might overwrite the newly uploaded one.
      });

      if (!profileRes.ok) return;

      // 3. Update password if provided
      if (newPassword.length >= 6) {
        const passwordRes = await changePassword({
          newPassword: newPassword.trim(),
        });

        if (!passwordRes.ok) return;
      }

      router.back();
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <ScreenContainer showAddButton={false}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingHorizontal: ms(20, 0.7),
          paddingTop: vs(10),
          height: vs(50),
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={ms(24, 0.5)} color="#000" />
        </TouchableOpacity>
        <Text
          className="font-nunito-bold text-moss"
          style={{ fontSize: ms(18, 0.5) }}
        >
          Edit Profile
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={!canSave}>
          {updating || changingPassword || imageLoading ? (
            <View className="items-center justify-center">
              <Text className="font-nunito-bold text-moss">...</Text>
            </View>
          ) : (
            <Ionicons
              name="checkmark"
              size={ms(24, 0.5)}
              color={canSave ? "#385a41" : "#a0b089"}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ms(20, 0.7),
          paddingTop: vs(20),
          paddingBottom: vs(40),
          gap: vs(24),
        }}
      >
        {/* Profile Picture Section */}
        <View className="items-center">
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            style={{
              width: ms(110, 0.5),
              height: ms(110, 0.5),
              borderRadius: ms(55, 0.5),
              backgroundColor: "#f0f2f0",
              borderWidth: 2,
              borderColor: "#e0e0e0",
              borderStyle: "dashed",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "visible",
            }}
          >
            {selectedImage || user?.avatarUrl ? (
              <Image
                source={{ uri: selectedImage || user?.avatarUrl }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: ms(55, 0.5),
                }}
              />
            ) : (
              <View className="items-center justify-center">
                <Ionicons name="person" size={ms(40, 0.5)} color="#999" />
                <Text
                  className="font-nunito text-leaf text-center"
                  style={{ fontSize: ms(10, 0.5), marginTop: vs(4) }}
                >
                  Tap to add
                </Text>
              </View>
            )}

            {/* Camera Icon Badge */}
            <View
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                backgroundColor: "#588157",
                borderRadius: ms(18, 0.5),
                width: ms(32, 0.5),
                height: ms(32, 0.5),
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 3,
                borderColor: "#fff",
              }}
            >
              <Ionicons name="camera" size={ms(16, 0.5)} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text
            className="font-nunito-semibold text-leaf"
            style={{ fontSize: ms(12, 0.5), marginTop: vs(12) }}
          >
            Change Profile Photo
          </Text>
        </View>

        {/* Your Information Section */}
        <View style={{ gap: vs(16) }}>
          <Text
            className="font-nunito-bold text-moss"
            style={{ fontSize: ms(18, 0.5) }}
          >
            Your Information
          </Text>

          <View style={{ gap: vs(12) }}>
            <TextInputs
              placeholder="Username"
              secure={false}
              value={username}
              onChangeText={setUsername}
            />
            <TextInputs
              placeholder="Bio"
              secure={false}
              value={bio}
              onChangeText={setBio}
              multiline={true}
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Change Password Section */}
        <View style={{ gap: vs(16) }}>
          <Text
            className="font-nunito-bold text-moss"
            style={{ fontSize: ms(18, 0.5) }}
          >
            Change Password
          </Text>

          <View style={{ gap: vs(12) }}>
            <TextInputs
              placeholder="New Password"
              secure={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInputs
              placeholder="Confirm New Password"
              secure={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        {(profileError || passwordError) && (
          <View className="bg-red-50 p-4" style={{ borderRadius: ms(8, 0.3) }}>
            <Text className="font-nunito text-red-600 text-center">
              {profileError || passwordError}
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

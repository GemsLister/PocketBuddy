import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";

export const useUpdateProfile = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async ({
    username,
    bio,
    avatarUrl,
  }: {
    username: string;
    bio: string;
    avatarUrl?: string | null;
  }) => {
    try {
      setUpdating(true);
      setError(null);

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) throw new Error("No user found");

      const updateData: any = {
        username: username.trim(),
        bio: bio.trim(),
      };

      if (avatarUrl !== undefined) {
        updateData.avatar_url = avatarUrl;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", authUser.id);

      if (updateError) throw updateError;

      // UPDATE AUTH METADATA: Kini ang sekreto para mo-update ang session
      // bisag dili mo-logout. Ang Supabase Auth naggamit og metadata
      // nga gi-cache sa session.
      await supabase.auth.updateUser({
        data: {
          username: username.trim(),
          avatar_url:
            avatarUrl !== undefined
              ? avatarUrl
              : authUser.user_metadata.avatar_url,
        },
      });

      showMessage({
        message: "Success",
        description: "Profile updated successfully!",
        type: "success",
        icon: "success",
      });

      return { ok: true };
    } catch (e: any) {
      const errorMessage = e?.message ?? "Failed to update profile";
      setError(errorMessage);
      showMessage({
        message: "Update Failed",
        description: errorMessage,
        type: "danger",
        icon: "danger",
      });
      return { ok: false };
    } finally {
      setUpdating(false);
    }
  };

  return { updateProfile, updating, error };
};

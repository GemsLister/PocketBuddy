import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";

const AVATARS_BUCKET = "avatars";

export const useUpdateProfileImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfileImage = async (file: {
    uri: string;
    mimeType?: string;
    filename?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw new Error("User not authenticated");
      }

      console.log("Attempting to upload image from URI:", file.uri);

      const extension = file.uri.split(".").pop() || "jpg";
      const path = `${authUser.id}/avatar-${Date.now()}.${extension}`; // Use timestamp to avoid cache issues

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: `avatar.${extension}`,
        type: file.mimeType ?? `image/${extension === "jpg" ? "jpeg" : extension}`,
      } as any);

      const { error: uploadError } = await supabase.storage
        .from(AVATARS_BUCKET)
        .upload(path, formData, {
          upsert: true,
          contentType: file.mimeType ?? `image/${extension === "jpg" ? "jpeg" : extension}`,
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        throw uploadError;
      }

      const { data: publicData } = supabase.storage
        .from(AVATARS_BUCKET)
        .getPublicUrl(path);

      if (!publicData) {
        throw new Error("Failed to get public URL for uploaded image");
      }

      const avatarUrl = publicData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", authUser.id);

      if (updateError) {
        console.error("Supabase Profile Update Error:", updateError);
        throw updateError;
      }

      // UPDATE AUTH METADATA: I-sync ang bag-ong avatar sa Auth session
      await supabase.auth.updateUser({
        data: {
          avatar_url: avatarUrl
        }
      });

      showMessage({
        message: "Success",
        description: "Profile picture updated successfully!",
        type: "success",
        icon: "success",
      });

      return { ok: true };
    } catch (e: any) {
      console.error("updateProfileImage detailed error:", e);
      const errorMessage = e?.message ?? "Failed to update profile image";
      setError(errorMessage);
      showMessage({
        message: "Upload Failed",
        description: errorMessage,
        type: "danger",
        icon: "danger",
      });
      return { ok: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { updateProfileImage, loading, error };
};

import { supabase } from "@/src/lib/supabase";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";

const redirectTo = Linking.createURL("login");

export const useForgotPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      showMessage({
        message: "Error",
        description: "Please enter your email address.",
        type: "danger",
        icon: "danger",
      });
      return { ok: false };
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: redirectTo,
        }
      );

      if (resetError) {
        showMessage({
          message: "Error",
          description: resetError.message,
          type: "danger",
          icon: "danger",
        });
        return { ok: false };
      }

      setSuccess(true);
      showMessage({
        message: "Success!",
        description: "Reset link sent! Please check your email.",
        type: "success",
        icon: "success",
        duration: 4000,
      });

      setTimeout(() => {
        setSuccess(false);
        router.replace("/(auth)/login");
      }, 3000);

      return { ok: true };
    } catch (err: any) {
      showMessage({
        message: "Error",
        description: err.message || "An unexpected error occurred.",
        type: "danger",
        icon: "danger",
      });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };
  return { handleForgotPassword, loading, error, success };
};

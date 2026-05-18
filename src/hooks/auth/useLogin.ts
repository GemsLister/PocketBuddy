import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";

export const useLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(email: string, password: string) {
    if (!email || !password) {
      showMessage({
        message: "Error",
        description: "Please enter both email and password.",
        type: "danger",
        icon: "danger",
      });
      return { ok: false };
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

      if (loginError) {
        console.log("Login Error:", loginError.message);
        showMessage({
          message: "Login Failed",
          description: loginError.message,
          type: "danger",
          icon: "danger",
        });
        return { ok: false };
      }

      router.replace("/(tabs)/records");
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
  }
  return { handleLogin, loading, error };
};

import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";

export const useSignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (
    username: string,
    email: string,
    password: string,
  ) => {
    if (!username || !email || !password) {
      showMessage({
        message: "Error",
        description: "Please fill in all fields.",
        type: "danger",
        icon: "danger",
      });
      return { ok: false };
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Step 1: Sign up with email and password
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signUpError) {
        showMessage({
          message: "Registration Failed",
          description: signUpError.message,
          type: "danger",
          icon: "danger",
        });
        return { ok: false };
      }

      // Step 2: Store username in profiles table
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            username: username.trim(),
            email: email.trim(),
          },
        ]);

        if (profileError) {
          console.log("Profile Error:", profileError.message);
        }
      }

      setSuccess(true);
      showMessage({
        message: "Success!",
        description: "Successfully Registered! Redirecting to login...",
        type: "success",
        icon: "success",
        duration: 3000,
      });

      setTimeout(() => {
        setSuccess(false);
        router.replace("/(auth)/login");
      }, 2000);

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

  return { handleSignUp, loading, error, success };
};

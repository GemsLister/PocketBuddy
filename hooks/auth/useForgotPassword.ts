import { createClient } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const redirectTo = Linking.createURL("login");
const router = useRouter();
// ---cut---
export const useForgotPassword = () => {
  const handleForgotPassword = async (email: string) => {
    if (!email) console.log("Email is empty!");

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });
    if (error) {
      console.log("Error sending link:", error.message);
      console.log(error.status);
    } else {
      console.log("SUCCESS");
      router.replace("/(auth)/login");
    }
  };
  return { handleForgotPassword };
};

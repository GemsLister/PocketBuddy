import { createClient } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useSignUp = () => {
  const router = useRouter();
  const redirectTo = Linking.createURL("records");
  const handleSignUp = async (email: string, password: string) => {
    // I-log nato ang URL para makita nato kon sakto ba
    console.log("Checking Supabase URL:", supabaseUrl);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      console.log("Error Message:", error.message);
      console.log("Error Status:", error.status);
    } else {
      console.log("SUCCESS!");
      router.replace("/(tabs)/records");
    }
  };

  return { handleSignUp };
};

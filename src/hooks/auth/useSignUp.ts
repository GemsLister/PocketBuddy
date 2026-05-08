import { createClient } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useSignUp = () => {
  const router = useRouter();
  // const redirectTo = Linking.createURL("records");
  const handleSignUp = async (
    username: string,
    email: string,
    password: string,
  ) => {
    // I-log nato ang URL para makita nato kon sakto ba
    console.log("Checking Supabase URL:", supabaseUrl);

    // Step 1: Sign up with email and password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log("Error Message:", error.message);
      console.log("Error Status:", error.status);
    } else {
      console.log("SUCCESS!");

      // Step 2: Store username in profiles table
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            username: username,
            email: email,
          },
        ]);

        if (profileError) {
          console.log("Profile Error:", profileError.message);
        } else {
          console.log("Username stored successfully!");
        }
      }

      router.replace("/(auth)/login");
    }
  };

  return { handleSignUp };
};

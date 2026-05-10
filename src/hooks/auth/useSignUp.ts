import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";

export const useSignUp = () => {
  const router = useRouter();
  // const redirectTo = Linking.createURL("records");
  const handleSignUp = async (
    username: string,
    email: string,
    password: string,
  ) => {

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

import { createClient } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const router = useRouter();
export const useLogin = () => {
  async function handleLogin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      console.log("Invalid Email or Password");
      console.log(error.status);
    } else router.replace("/(tabs)/records");
  }
  return { handleLogin };
};

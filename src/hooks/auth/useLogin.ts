import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";

export const useLogin = () => {
  const router = useRouter();
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

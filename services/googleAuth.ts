import { supabase } from "@/lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const handleGoogleLogin = async () => {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    // offlineAccess: true,
    // forceCodeForRefreshToken: true,
  });
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    console.log("Google user:", userInfo);

    const idToken = userInfo.data?.idToken;
    if (!idToken) {
      console.log("❌ No ID Token received");
      return null;
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });

    if (error) {
      console.log("❌ Supabase error:", error.message);
      return null;
    }

    console.log("✅ Logged in user:", data.user);

    return data.user;
  } catch (error: any) {
    console.log("❌ Google Sign-In Error:", error.message);
    return null;
  }
};

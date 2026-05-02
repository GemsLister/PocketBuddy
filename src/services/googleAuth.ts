import { supabase } from "@/src/lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const GOOGLE_WEB_CLIENT_ID =
  "176157485217-njtc9hehl1k1gbf7pqk7u9vnd6fmumgh.apps.googleusercontent.com";

export const handleGoogleLogin = async (router: any) => {
  try {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ["profile", "email"],
    });

    console.log("🔐 Checking Google Play Services...");
    await GoogleSignin.hasPlayServices();

    console.log("🔐 Initiating Google Sign-In...");
    const userInfo = await GoogleSignin.signIn();
    // console.log(
    //   "✅ Google Sign-In Success:",
    //   userInfo.user?.email || "User signed in",
    // );

    // Extract ID Token
    const idToken = userInfo.data?.idToken;
    if (!idToken) {
      console.log("❌ No ID Token received from Google");
      alert("Google Sign-In failed: No ID token. Please try again.");
      return null;
    }

    // Sign in with Supabase using Google ID Token
    console.log("🔐 Authenticating with Supabase...");
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });

    if (error) {
      console.log("❌ Supabase authentication failed:", error.message);
      alert(`Supabase error: ${error.message}`);
      return null;
    }

    console.log("✅ Successfully logged in:", data.user?.email);

    // Navigate to records tab after successful login
    router.replace("/(tabs)/records");
    return data.user;
  } catch (error: any) {
    console.log("❌ Google Sign-In Error:", error.message);
    console.log("Error Code:", error.code);
    console.log("Full Error:", JSON.stringify(error, null, 2));

    // Show user-friendly error message
    let errorMessage = "Google Sign-In failed. Please try again.";
    if (error.code === "CANCELED") {
      errorMessage = "Sign-In cancelled";
    } else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
      errorMessage = "Google Play Services not available";
    } else if (error.code === "DEVELOPER_ERROR") {
      errorMessage = "Configuration error. Please contact support.";
    }

    alert(errorMessage);
    return null;
  }
};

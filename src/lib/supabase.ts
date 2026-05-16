import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";

// AsyncStorage accesses `window` internally, which does not exist during
// Expo's server-side rendering pass (Node.js).  This thin wrapper returns
// harmless no-ops when running outside a browser/device context so the
// Supabase client can safely be created at module scope.
const SafeStorage = {
  getItem: (key: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") return null;
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") return;
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") return;
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: SafeStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
);

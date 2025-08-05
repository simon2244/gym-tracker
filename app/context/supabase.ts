import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

// Environment-Variablen laden
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabaseOptions = {};

if (Platform.OS !== "web") {
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  supabaseOptions = {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  };
} else {
  // Web: localStorage wird automatisch verwendet, kein AsyncStorage nötig
  supabaseOptions = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // true = Supabase verarbeitet URL-Redirects nach OAuth z. B.
    },
  };
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  supabaseOptions,
);

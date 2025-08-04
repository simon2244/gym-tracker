import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = "https://dsfldmcxrieeedbvtsst.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZmxkbWN4cmllZWVkYnZ0c3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTA1NDIsImV4cCI6MjA2OTU2NjU0Mn0.G5Ndc7Vnl1BxFB4ZkZNUdaknkxWLuKkbuxMu-oooHmk";

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

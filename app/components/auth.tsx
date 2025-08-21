import React, { useState, useEffect } from "react";
import { Alert, AppState, KeyboardAvoidingView } from "react-native";
import { supabase } from "../lib/supabase";
import {
  TextInput,
  Button,
  useTheme,
  Title,
  Surface,
} from "react-native-paper";
import Constants from "../constants";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => subscription.remove();
  }, []);

  async function signInWithEmail() {
    setLoading(true);
    
    // Validate inputs before sending to Supabase
    if (!email || !email.includes('@')) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      setLoading(false);
      return;
    }
    
    if (!password) {
      Alert.alert("Missing Password", "Please enter your password");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Invalid login credentials")) {
          Alert.alert("Login Failed", "Invalid email or password. Please check your credentials and try again.");
        } else {
          Alert.alert("Login Error", error.message);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
    
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    
    // Validate inputs before sending to Supabase
    if (!email || !email.includes('@')) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      setLoading(false);
      return;
    }
    
    if (!password || password.length < 6) {
      Alert.alert("Invalid Password", "Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email: email.trim().toLowerCase(), 
        password 
      });

      if (error) {
        console.error("Signup error:", error);
        // Provide more specific error messages
        if (error.message.includes("already registered")) {
          Alert.alert("Account Exists", "This email is already registered. Try signing in instead.");
        } else if (error.message.includes("Password")) {
          Alert.alert("Password Error", "Password must be at least 6 characters long");
        } else if (error.message.includes("email")) {
          Alert.alert("Email Error", "Please enter a valid email address");
        } else {
          Alert.alert("Signup Error", error.message);
        }
      } else if (data.session) {
        Alert.alert("Signup Successful", "You are now signed in!");
      } else {
        Alert.alert("Check Your Email", "We've sent you a verification link. Please check your email and click the link to verify your account.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
    
    setLoading(false);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center" }}
        behavior="padding"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
            backgroundColor: Constants.backgroundDark,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="email@address.com"
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input]}
            mode="outlined"
            textColor="#fff"
            outlineColor={Constants.primaryBlue}
            activeOutlineColor={Constants.primaryBlue}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            style={[styles.input]}
            textColor="#fff"
            mode="outlined"
            outlineColor={Constants.primaryBlue}
            activeOutlineColor={Constants.primaryBlue}
          />

          <Button
            mode="contained"
            onPress={signInWithEmail}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={{ backgroundColor: Constants.primaryBlue }}
          >
            Sign In
          </Button>

          <Button
            mode="outlined"
            onPress={signUpWithEmail}
            loading={loading}
            disabled={loading}
            style={styles.button}
            textColor={'#fff'}
          >
            Sign Up
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>

  );
}

const styles = {
  surface: {
    flex: 1,
    padding: 24,
    // justifyContent: 'center' as const,
    backgroundColor: Constants.backgroundDark,
  },
  title: {
    textAlign: "center" as "center",
    marginBottom: 32,
    color: "#fff",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#222",
  },
  button: {
    marginTop: 8,
    borderColor: Constants.primaryBlue,
  },
};

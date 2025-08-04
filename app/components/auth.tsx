import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import { supabase } from "../context/supabase";
import { TextInput, Button, useTheme, Title } from "react-native-paper";

export default function Auth() {
  const { colors } = useTheme();
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

    return () => subscription.remove(); // Cleanup listener on unmount
  }, []);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert("Login error", error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });

    if (error) Alert.alert("Signup error", error.message);
    if (!session) Alert.alert("Check your email for a verification link!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Welcome to Gym Tracker</Title>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={signInWithEmail}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Sign In
      </Button>

      <Button
        mode="outlined"
        onPress={signUpWithEmail}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

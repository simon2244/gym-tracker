import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import Constants from "../constants";
import { PlansProvider } from "../context/planscontext";
import { Session } from "@supabase/supabase-js";
import Auth from "../components/auth";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";

export default function TabLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) return null;

  if (!session || !session.user) {
    return <Auth />;
  }

  return (
    <PlansProvider>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: Constants.primaryBlue,
          headerStyle: {
        backgroundColor: Constants.backgroundDark,
          },
          headerShadowVisible: false,
          headerTintColor: "#fff",
          tabBarStyle: {
        backgroundColor: Constants.backgroundDark,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
        title: "Workout Plans",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "home-sharp" : "home-outline"}
            color={color}
            size={24}
          />
        ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
        title: "Calendar",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "calendar" : "calendar-outline"}
            color={color}
            size={24}
          />
        ),
          }}
        />
        <Tabs.Screen
          name="clock"
          options={{
        title: "Interval Timer",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "alarm" : "alarm-outline"}
            color={color}
            size={24}
          />
        ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
        title: "My Account",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "person" : "person-outline"}
            color={color}
            size={24}
          />
        ),
          }}
        />
      </Tabs>
    </PlansProvider>
  );
}

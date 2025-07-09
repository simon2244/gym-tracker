import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from '../constants';


export default function TabLayout() {
  return (
    <Tabs
    initialRouteName='index'
      screenOptions={{
    tabBarActiveTintColor: Constants.primaryBlue,
    headerStyle: {
      backgroundColor: Constants.backgroundDark,
    },
    headerShadowVisible: false,
    headerTintColor: '#fff',
    tabBarStyle: {
      backgroundColor: Constants.backgroundDark,
    },
  }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Workout Plans',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={24}/>
          ),
        }}
      />
       <Tabs.Screen
        name="clock"
        options={{
          title: 'Interval Timer',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'alarm' : 'alarm-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cog' : 'cog-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}

import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          height: insets.bottom + 30,
          borderTopWidth: 0,
          elevation: 10,
          bottom: insets.bottom, // Adjusted to account for safe area insets
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Rubik-Regular",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Octicons name="home" size={24} color={focused ? color : "gray"} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          headerShown: false,
          title: "explore",
          tabBarIcon: ({ color, focused }) => (
            <Octicons
              name="location"
              size={24}
              color={focused ? color : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          headerShown: false,
          title: "bookings",
          tabBarIcon: ({ color, focused }) => (
            <Octicons
              name="calendar"
              size={24}
              color={focused ? color : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "profile",
          tabBarIcon: ({ color, focused }) => (
            <Octicons
              name="person"
              size={24}
              color={focused ? color : "gray"}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

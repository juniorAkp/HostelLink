import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(screens)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default RootLayout;

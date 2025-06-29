import { Stack } from "expo-router";
import React from "react";

const AuthScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="GetEmail" options={{ headerShown: false }} />
      <Stack.Screen name="CompleteProfile" options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} />
      <Stack.Screen name="ResetPassword" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthScreenLayout;

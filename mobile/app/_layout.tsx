import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import "./global.css";

import { AuthProvider, useAuth } from "@/provider/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: 1,
    },
  },
});

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [fontLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout />
        <Toast
          position="top"
          visibilityTime={3000}
          autoHide={true}
          topOffset={30}
        />
      </AuthProvider>
    </QueryClientProvider>
  );

  function Layout() {
    const { isAuthenticated } = useAuth();
    const [checkingToken, setCheckingToken] = useState(true);
    useEffect(() => {
      const checkAuthToken = async () => {
        try {
          setCheckingToken(true);
          await SecureStore.getItemAsync("authToken");
        } catch (error) {
          console.error("Token check failed:", error);
        } finally {
          setCheckingToken(false);
          if (fontLoaded) {
            await SplashScreen.hideAsync();
          }
        }
      };
      checkAuthToken();
    }, []);
    if (checkingToken || !fontLoaded) {
      return null;
    }
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" redirect={isAuthenticated} />
        <Stack.Screen name="(root)" redirect={!isAuthenticated} />
      </Stack>
    );
  }
}

import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 30000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  //check if the request fails with a 401 error
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";
    config.headers["Accept-Language"] = "en-US,en;q=0.9";
  }
  return config;
});

// response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.error("Axios error:", error);
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      //get refresh token
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        try {
          const response = await axiosInstance.post(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          );
          if (response.data.accessToken && response.data.refreshToken) {
            await SecureStore.setItemAsync(
              "accessToken",
              response.data.accessToken
            );
            await SecureStore.setItemAsync(
              "refreshToken",
              response.data.refreshToken
            );
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${response.data.accessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          router.replace("/(auth)/login");
          return Promise.reject(error);
        }
      }
    }
  }
);

export default axiosInstance;

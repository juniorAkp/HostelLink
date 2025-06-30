import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axiosInstance from "./axiosInstance";

export const login = async (email: string, password: string) => {
  try {
    const res = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    await SecureStore.setItemAsync("accessToken", res.data.accessToken);
    await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
    await SecureStore.setItemAsync("userData", JSON.stringify(res.data.user));
    return res.data;
  } catch (error) {
    console.error("Login error from auth:", error);
    throw error;
  }
};

export const register = async (
  email: string,
  password: string,
  username: string,
  gender: string
) => {
  try {
    const res = await axiosInstance.post("/auth/register", {
      email,
      password,
      username,
      gender,
    });
    //replace screen to verification code screen
    router.replace(`/(auth)/verify-email?email=${encodeURIComponent(email)}`);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const res = await axiosInstance.post("/auth/verify-email", {
      token,
    });
    if (res.data.success) {
      await SecureStore.setItemAsync("accessToken", res.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
    }
    return res.data;
  } catch (error) {
    console.error("Email verification error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    console.log("refreshtoken", await SecureStore.getItemAsync("refreshToken"));
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (refreshToken) {
      const data = await axiosInstance.post("/auth/logout", { refreshToken });
      return data;
    }
    await SecureStore.deleteItemAsync("accessToken");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const data = await axiosInstance.post("/auth/forgot-password", { email });
    //navigate to reset token screen
    router.push(
      `/(root)/(screens)/ForgotPassword?email=${encodeURIComponent(email)}`
    );
    return data;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const data = await axiosInstance.post("/auth/reset-password", {
      token,
      password: newPassword,
    });
    return data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const res = await axiosInstance.get("/auth/profile");
    return res.data.user;
  } catch (error) {
    console.error("Get user profile error:", error);
    throw error;
  }
};

import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "@/api/auth";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  email: string;
  username: string;
  dob: string;
  profile_url: string;
  role: string;
  createdAt: string;
  lastLogin: string;
  gender: string;
}
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleRegister: (
    email: string,
    password: string,
    username: string,
    gender: string
  ) => Promise<void>;
  handleForgotPassword: (email: string) => Promise<void>;
  handleResetPassword: (token: string, newPassword: string) => Promise<void>;
  handleVerifyEmail: (email: string) => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("userData");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await login(email, password);
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        setMessage(data.message || "Login successful");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("login error:", error);
      let errorMessage = "Login failed";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    username: string,
    gender: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await register(email, password, username, gender);
      if (data.success) {
        setMessage(data.message || "Registration successful");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await SecureStore.deleteItemAsync("userData");
      const data = await logout();
      if (data) {
        setUser(null);
        setIsAuthenticated(false);
        setMessage(data.data?.message || "Logout successful");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await forgotPassword(email);
      if (data) {
        setMessage(
          data.data.message || "Forgot password email sent successfully"
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Forgot password error:", error);
      let errorMessage = "Forgot password failed";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await resetPassword(token, newPassword);
      if (data?.data.success) {
        setMessage(data.data.message || "Password reset successful");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Reset password error:", error);
      let errorMessage = "Reset password failed";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await verifyEmail(token);
      if (data?.success) {
        setMessage(data.message || "Email verification successful");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Email verification error:", error);
      let errorMessage = "Email verification failed";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        user,
        message,
        error,
        isAuthenticated,
        handleLogin,
        handleRegister,
        handleLogout,
        handleForgotPassword,
        handleResetPassword,
        handleVerifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

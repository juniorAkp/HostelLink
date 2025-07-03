import CustomButton from "@/components/button";
import { socialIcons } from "@/constants";
import { useAuth } from "@/provider/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
const Register = () => {
  const [showPassword, setShowPassword] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const router = useRouter();
  const { handleLogin: login, message, error, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields.",
      });
    }
    try {
      await login(email, password);
      if (message) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: message,
        });
      }
      if (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error ?? undefined,
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred.",
      });
    }
  };
  const handleSocialLogin = (provider: string) => {
    // Handle social login logic here
    console.log(`Logging in with ${provider}`);
  };
  return (
    <SafeAreaView className="h-full flex-1 bg-white p-3">
      <ScrollView contentContainerClassName=" mt-9">
        <View className="flex items-center justify-center">
          <Text className="text-3xl font-rubik-medium border border-white">
            Sign In
          </Text>
          <Text className="text-base font-rubik text-gray-500 mt-3 text-center">
            Hi! Welcome back you've been missed
          </Text>
        </View>
        <View className=" mt-6 gap-5 ">
          {/* Add  your registration form components here */}

          <Text className="text-lg font-rubik p-2">Email</Text>
          <TextInput
            style={{
              fontSize: 16,
              backgroundColor: "#f4f4f4",
              borderColor: "#f4f4f4",
              height: 50,
            }}
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(e) => setEmail(e)}
            keyboardType="email-address"
            keyboardAppearance="default"
            className="border border-gray-300 p-3 rounded-md"
            placeholder="example@example.com"
          />
          <Text className="text-lg font-rubik p-2">Password</Text>
          <View className="relative justify-center">
            <TextInput
              style={{
                fontSize: 16,
                backgroundColor: "#f4f4f4",
                borderColor: "#f4f4f4",
                height: 50,
                paddingRight: 50,
              }}
              autoCapitalize="none"
              secureTextEntry={true}
              autoCorrect={false}
              value={password}
              onChangeText={(e) => setPassword(e)}
              keyboardType="visible-password"
              keyboardAppearance="default"
              className="border border-gray-300 p-3 rounded-md w-full"
              placeholder="*******"
            />
            <View className="absolute right-3 top-3">
              {showPassword ? (
                <Ionicons
                  name="eye-off-outline"
                  size={24}
                  color="gray"
                  onPress={() => setShowPassword(!showPassword)}
                />
              ) : (
                <Ionicons
                  name="eye-outline"
                  size={24}
                  color="gray"
                  onPress={() => setShowPassword(!showPassword)}
                />
              )}
            </View>
            <TouchableWithoutFeedback
              className="items-end justify-end"
              onPress={() => router.push("/(root)/(screens)/auth/GetEmail")}
            >
              <Text className="text-sm font-rubik text-blue-600 mt-2 text-right">
                Forgot Password?
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <CustomButton
            isLoading={isLoading}
            title="Sign In"
            onPress={handleLogin}
          />
        </View>
        <View className="flex items-center justify-center mt-7 px-9">
          <View className="flex flex-row items-center w-full">
            <View className="flex-1 border-t border-gray-300" />
            <Text className="mx-4 text-base font-rubik text-gray-500">
              Or sign in with
            </Text>
            <View className="flex-1 border-t border-gray-300" />
          </View>
          <View className="flex flex-row gap-3 mt-5">
            <TouchableOpacity className="flex items-center justify-center rounded-full bg-white border border-gray-300 p-2">
              <Image
                source={socialIcons.apple}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center justify-center rounded-full bg-white border border-gray-300 p-2">
              <Image
                source={socialIcons.google}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View className="flex flex-row items-center justify-center mt-5">
            <Text className="text-base font-rubik text-gray-500">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              className="ml-2"
            >
              <Text className="text-base font-rubik text-blue-600">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

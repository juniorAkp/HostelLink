import CustomButton from "@/components/button";
import { socialIcons } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { SafeAreaView } from "react-native-safe-area-context";
const Register = () => {
  const [showPassword, setShowPassword] = React.useState(true);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  const router = useRouter();
  const handleRegister = () => {
    // Handle registration logic here
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
            Create Account
          </Text>
          <Text className="text-base font-rubik text-gray-500 mt-3 text-center">
            Fill in your information below or register
          </Text>
          <Text className="text-base font-rubik text-gray-500 mt-1 text-center">
            with your social account
          </Text>
        </View>
        <View className=" mt-6 gap-5 ">
          {/* Add  your registration form components here */}
          <Text className="text-lg font-rubik p-2">Name</Text>
          <TextInput
            style={{
              fontSize: 16,
              backgroundColor: "#f4f4f4",
              borderColor: "#f4f4f4",
              height: 50,
            }}
            autoCapitalize="none"
            value={name}
            onChangeText={(e) => setName(e)}
            autoCorrect={false}
            className="border border-gray-300 p-3 rounded-md"
            placeholder="example"
          />
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
            <View className="flex-row gap-2 mt-5 items-center">
              <BouncyCheckbox
                isChecked={termsAccepted}
                onPress={() => setTermsAccepted(!termsAccepted)}
                unFillColor="#FFFFFF"
                fillColor="blue"
                iconStyle={{ borderColor: "#f4f4f4" }}
                text="I accept the terms and conditions"
                textStyle={{ fontFamily: "Rubik-Regular" }}
              />
            </View>
          </View>
          <CustomButton title="Sign Up" onPress={handleRegister} />
        </View>
        <View className="flex items-center justify-center mt-7 px-9">
          <View className="flex flex-row items-center w-full">
            <View className="flex-1 border-t border-gray-300" />
            <Text className="mx-4 text-base font-rubik text-gray-500">
              Or sign up with
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
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              className="ml-2"
            >
              <Text className="text-base font-rubik text-blue-600">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

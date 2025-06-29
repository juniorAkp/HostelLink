import CustomButton from "@/components/button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = React.useState(true);
  const [password, setPassword] = React.useState("");

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex items-center justify-center rounded-full w-11 h-11 border border-gray-200">
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => router.back()}
          />
        </View>

        <View className="flex items-center justify-center mt-9">
          <Text className="text-3xl font-rubik-medium">New Password</Text>
          <Text className="text-base font-rubik text-gray-500 mt-3 text-center px-10">
            Your new password must be different from previously used passwords
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-lg font-rubik p-2">New Password</Text>

          <View className="relative">
            <TextInput
              style={{
                fontSize: 16,
                backgroundColor: "#f4f4f4",
                borderColor: "#f4f4f4",
                height: 50,
                paddingRight: 50,
              }}
              autoCapitalize="none"
              secureTextEntry={showPassword}
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
          </View>
          <CustomButton
            title="Reset Password"
            onPress={() => {}}
            className="mt-6"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;

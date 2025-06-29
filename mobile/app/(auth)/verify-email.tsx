import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const VerifyEmail = ({ email }: { email: string }) => {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    const newCode = code.split("");
    newCode[index] = text;
    setCode(newCode.join(""));
  };

  const handleResendCode = () => {
    if (isResendDisabled) return;

    // Reset the timer
    setTimeLeft(60);
    setIsResendDisabled(true);

    Alert.alert(
      "Code Resent",
      "A new verification code has been sent to your email."
    );
  };

  return (
    <SafeAreaView className="h-full flex-1 bg-white p-6">
      <View className="flex items-center justify-center rounded-full w-11 h-11 border border-gray-200 ">
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => router.back()}
        />
      </View>
      <View className="flex items-center justify-center mt-9">
        <Text className="text-2xl font-rubik-bold mb-2">Verify Code</Text>
        <Text className="text-base font-rubik text-gray-500 mt-3 text-center">
          Please enter the code we just sent to your email
        </Text>
        <Text className="text-base font-rubik text-blue-500 mt-3 text-center">
          {email || "juniorpappoe@gmail.com"}
        </Text>
      </View>

      <View className="flex flex-row justify-between mt-8 mb-6">
        {[0, 1, 2, 3].map((index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref as TextInput;
            }}
            className="w-16 h-16 border-2 border-gray-200 rounded-lg text-center text-2xl font-rubik-bold"
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleCodeChange(text, index)}
            value={code[index] || ""}
            autoFocus={index === 0}
            selectTextOnFocus
          />
        ))}
      </View>

      <View className="flex flex-row justify-center mt-4">
        <Text className="text-base font-rubik text-gray-500">
          Didn't receive code?
        </Text>

        {isResendDisabled ? (
          <Text className="text-base font-rubik text-gray-500 ml-1">
            Resend in {timeLeft}s
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendCode}>
            <Text className="text-base font-rubik-bold text-blue-500 ml-1">
              Resend
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmail;

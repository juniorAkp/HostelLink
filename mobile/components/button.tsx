import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  isLoading?: boolean;
}
const CustomButton = ({
  title,
  className,
  isLoading,
  onPress,
  ...props
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      disabled={isLoading}
      activeOpacity={0.3}
      className={`bg-blue-600 p-3 rounded-3xl flex items-center justify-center ${className}`}
      onPress={onPress}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text className="text-white font-rubik">{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

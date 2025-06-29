import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}
const CustomButton = ({
  title,
  className,
  onPress,
  ...props
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className={`bg-blue-600 p-3 rounded-3xl flex items-center justify-center ${className}`}
      onPress={onPress}
      {...props}
    >
      <Text className="text-white font-rubik">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

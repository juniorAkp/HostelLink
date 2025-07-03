import { images } from "@/constants";
import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const HostelsNearYou = () => {
  return (
    <TouchableOpacity className="flex flex-row items-center w-full p-3 bg-white shadow-md rounded-lg border border-gray-200">
      {/* Image Container (Left Side) */}
      <View className="relative">
        <Image
          source={images.hostel1}
          resizeMode="cover"
          className="w-32 h-32 rounded-lg"
        />
        <TouchableOpacity className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 items-center justify-center shadow-sm">
          <Octicons name="heart" size={16} color="#9acce3" />
        </TouchableOpacity>
      </View>

      {/* Text Content (Right Side) */}
      <View className="flex-1 ml-4">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg font-rubikBold">10% off</Text>
          <View className="flex flex-row items-center">
            <Octicons name="star-fill" size={14} color="#FFD700" />
            <Text className="text-sm font-rubik ml-1">4.5</Text>
          </View>
        </View>

        <Text className="text-base font-rubikBold mt-1">Hostel 1</Text>
        <Text className="text-sm font-rubik text-gray-500 mt-1">
          Accra, Ghana
        </Text>

        <View className="flex flex-row justify-between items-center mt-2">
          <Text className="text-sm font-rubik text-blue-500">GH₵ 5000</Text>
          <Text className="text-xs font-rubik text-gray-400">/semester</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HostelsNearYou;

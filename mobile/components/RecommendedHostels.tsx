import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface RecommendedHostelsProps {
  item: any;
}

const RecommendedHostels = ({
  item: { name, rating, location, price, isLiked, image, onPress },
}: RecommendedHostelsProps) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl w-[250px] border border-gray-200 overflow-hidden p-2"
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityLabel={`Hostel: ${name}, Rating: ${rating}, Price: GH₵${price}`}
      style={{ height: 300 }}
    >
      <View className="w-full h-48 relative">
        <Image
          source={image}
          className="w-full h-full rounded-md"
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        <TouchableOpacity className="absolute w-8 h-8 top-2 right-2 bg-white items-center justify-center rounded-full shadow-sm">
          <Octicons
            name={isLiked ? "heart-fill" : "heart"}
            size={18}
            color={isLiked ? "#EF4444" : "#9acce3"}
          />
        </TouchableOpacity>
      </View>
      <View className="p-3 pt-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-rubikBold" numberOfLines={1}>
            {name}
          </Text>
          <View className="flex-row items-center">
            <Octicons name="star-fill" size={18} color="#FFD700" />
            <Text className="text-sm font-rubik ml-1.5">{rating}</Text>
          </View>
        </View>
        <View className="flex-row items-center mb-3">
          {/* Increased mb */}
          <Octicons name="location" size={18} color="#6b7280" />
          <Text
            className="text-sm font-rubik text-gray-500 ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {location}
          </Text>
        </View>
        <Text className="text-lg font-rubikBold text-primary">
          GH₵ {parseFloat(price)}
          <Text className="text-sm font-rubik text-gray-500"> / semester</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecommendedHostels;

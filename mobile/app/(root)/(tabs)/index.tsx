import HostelsNearYou from "@/components/HostelsNearYou";
import RecommendedHostels from "@/components/RecommendedHostels";
import CustomSearchBar from "@/components/SearchBar";
import { images } from "@/constants";
import { useAuth } from "@/provider/AuthProvider";
import { useLocation } from "@/provider/LocationProvider";
import Octicons from "@expo/vector-icons/Octicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const hostels = [
  {
    id: "1",
    name: "Hostel A",
    rating: 4.5,
    location: "Accra, Ghana",
    price: 5000,
    image: images.hostel1,
  },
  {
    id: "2",
    name: "Hostel B",
    rating: 4.0,
    location: "Accra, Ghana",
    price: 4500,
    image: images.hostel2,
  },
];
export default function Index() {
  const { handleLogout } = useAuth();
  const { regionName } = useLocation();
  const [search, setSearch] = useState("");

  const filteredHostels = useMemo(() => {
    return hostels.filter(
      (hostel) =>
        hostel.name.toLowerCase().includes(search.toLowerCase()) ||
        hostel.location.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, hostels]);

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex-1">
        {/* Header */}
        <View className="flex flex-row justify-between items-center mt-4">
          <View className="gap-2">
            <Text className="text-md font-rubik text-[#595959]">Location</Text>
            <View className="gap-2 flex-row items-center">
              <Octicons
                name="location"
                size={18}
                color="blue"
                onPress={() =>
                  router.navigate("/(root)/(screens)/page/addLocation")
                }
              />
              <Text className="text-xl font-rubik text-black">
                {regionName || "Unknown"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full relative"
            onPress={() => console.log("Notification pressed")}
          >
            <Octicons name="bell" size={18} color="#6b7280" />
            <View className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full" />
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <CustomSearchBar search={search} setSearch={setSearch} />
        {/* Recommended Hostels */}
        <View className="mt-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="font-rubik-semibold text-xl">
              Recommended Hostels
            </Text>
            <TouchableOpacity
              onPress={() => console.log("See All recommended")}
            >
              <Text className="text-blue-500 font-rubik text-lg">See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            contentContainerStyle={{
              paddingVertical: 15,
              gap: 20,
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={filteredHostels}
            renderItem={({ item }) => <RecommendedHostels item={item} />}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text className="text-gray-500 mt-4">No hostels found</Text>
            }
          />
        </View>

        {/* Nearby Hostels */}
        <View className="mt-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="font-rubik-semibold text-xl">Nearyby Hostels</Text>
            <TouchableOpacity onPress={() => console.log("See All nearby")}>
              <Text className="text-blue-500 font-rubik text-lg">See All</Text>
            </TouchableOpacity>
          </View>
          <HostelsNearYou />
        </View>
      </View>
    </SafeAreaView>
  );
}

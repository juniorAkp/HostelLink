import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { useDebounce } from "use-debounce";

interface SearchBarProps {
  search: string;
  setSearch: (text: string) => void;
}

const CustomSearchBar = ({ search, setSearch }: SearchBarProps) => {
  //debounce the search input
  const [debouncedSearch] = useDebounce(search, 300);
  return (
    <View className="mt-4 flex flex-row items-center gap-3">
      <SearchBar
        placeholder="Search hostels..."
        //@ts-ignore
        onChangeText={(text: string) => setSearch(text)}
        value={search}
        onClear={() => setSearch("")}
        onBlur={() => setSearch("")}
        platform="ios"
        containerStyle={{
          backgroundColor: "transparent",
          width: "85%",
          borderWidth: 0,
          borderTopWidth: 0,
          borderBottomWidth: 0,
        }}
        inputContainerStyle={{
          backgroundColor: "white",
          borderRadius: 15,
          paddingHorizontal: 10,
        }}
        searchIcon={() => <Octicons name="search" size={20} color="#6b7280" />}
        clearIcon={() => <Octicons name="x" size={20} color="#6b7280" />}
      />
      <TouchableOpacity
        className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
        onPress={() => console.log("Filter pressed")}
      >
        <Octicons name="filter" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomSearchBar;

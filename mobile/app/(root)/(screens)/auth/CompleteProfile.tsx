import CustomButton from "@/components/button";
import { images } from "@/contants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Dropdown from "react-native-input-select";
import { SafeAreaView } from "react-native-safe-area-context";
const CompleteProfile = () => {
  const [gender, setGender] = React.useState("");
  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex items-center justify-center rounded-full w-11 h-11 border border-gray-200 ">
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => router.back()}
          />
        </View>
        <View className="flex items-center justify-center mt-9">
          <Text className="text-2xl font-rubik-medium">
            Complete Your Profile
          </Text>
          <Text className="text-base font-rubik text-gray-500 mt-3 text-center">
            Please fill in the details below to complete your profile.
          </Text>
          {/* Add profile image upload and form fields here */}
          <View className="mt-6 rounded-full w-52 h-52 items-center justify-center relative">
            <Image source={images.person} className="w-52 h-52 rounded-full" />
            <TouchableOpacity
              onPress={() => {}}
              className="absolute bottom-0 right-0 mb-2 mr-2 w-12 h-12 rounded-full bg-white items-center justify-center shadow-md"
            >
              <FontAwesome name="pencil-square-o" size={24} color="blue" />
            </TouchableOpacity>
          </View>
        </View>
        <View className=" mt-6 gap-5 ">
          {/* Add  your registration form components here */}
          <Text className="text-lg font-rubik">Username</Text>
          <TextInput
            style={{
              fontSize: 16,
              backgroundColor: "#f4f4f4",
              borderColor: "#f4f4f4",
              height: 50,
            }}
            autoCapitalize="none"
            autoCorrect={false}
            value={""}
            onChangeText={() => {}}
            keyboardType="default"
            keyboardAppearance="default"
            className="border border-gray-300 p-3 rounded-md font-rubik"
            placeholder="username"
          />
          <Text className="text-lg font-rubik">Phone Number</Text>
          <View className="flex flex-row gap-4 justify-center items-center">
            <View className="w-20 h-14 items-center justify-center bg-[#f4f4f4] border border-[#f4f4f4] rounded-md">
              <Text className="font-rubik">+233</Text>
            </View>
            <View className="flex-1">
              <TextInput
                style={{
                  fontSize: 16,
                  backgroundColor: "#f4f4f4",
                  borderColor: "#f4f4f4",
                  height: 50,
                }}
                autoCapitalize="none"
                autoCorrect={false}
                value={""}
                maxLength={9}
                onChangeText={() => {}}
                keyboardType="phone-pad"
                keyboardAppearance="default"
                className="border border-gray-300 p-3 rounded-md font-rubik"
                placeholder="123456789"
              />
            </View>
          </View>
          <Text className="text-lg font-rubik">Gender</Text>
          <Dropdown
            dropdownContainerStyle={{
              borderColor: "#f4f4f4",
              backgroundColor: "#f4f4f4",
              height: 50,
              borderRadius: 8,
              padding: 10,
              justifyContent: "center",
            }}
            dropdownIconStyle={{
              display: "none",
            }}
            placeholderStyle={{
              color: "#999",
              textAlign: "left",
            }}
            placeholder="Select an option..."
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
            selectedValue={gender}
            onValueChange={(value) =>
              setGender(typeof value === "string" ? value : "")
            }
            primaryColor="green"
          />
        </View>
        <CustomButton title="Complete Profile" onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompleteProfile;

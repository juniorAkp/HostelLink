import { Text, View } from "react-native";

// Prevent the splash screen from auto-hiding

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-red-300 font-rubik-extrabold">
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}

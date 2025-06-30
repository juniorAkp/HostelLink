import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <View style={{ backgroundColor: color, width: 24, height: 24 }} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

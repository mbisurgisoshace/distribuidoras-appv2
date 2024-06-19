import React from "react";
import { View, Text } from "react-native";
import { useUser } from "@clerk/clerk-expo";

const Map = () => {
  const { user } = useUser();

  console.log("user", user?.publicMetadata);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome, {user?.emailAddresses[0].emailAddress} 🎉</Text>
    </View>
  );
};

export default Map;

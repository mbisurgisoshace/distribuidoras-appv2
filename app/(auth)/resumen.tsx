import React from "react";
import { View } from "react-native";
import { useUser } from "@clerk/clerk-expo";

const Resumen = () => {
  const { user } = useUser();

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    ></View>
  );
};

export default Resumen;

import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PedidosList from "@/components/PedidosList";

const Home = () => {
  const { user } = useUser();

  console.log("user", user?.publicMetadata);

  if (Platform.OS === "android")
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <PedidosList />
      </SafeAreaView>
    );

  return (
    <View style={{ flex: 1 }}>
      <PedidosList />
    </View>
  );
};

export default Home;

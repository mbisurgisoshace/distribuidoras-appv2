import React from "react";
import { View, Text } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import Card from "@/components/ui/Card";
import PedidoCard from "@/components/PedidoCard";
import PedidosList from "@/components/PedidosList";

const Home = () => {
  const { user } = useUser();

  console.log("user", user?.publicMetadata);

  return (
    <View style={{ flex: 1 }}>
      <PedidosList />
    </View>
  );
};

export default Home;

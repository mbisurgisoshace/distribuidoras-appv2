import { useState } from "react";
import { SwipeListView } from "react-native-swipe-list-view";

import PedidoCard from "./PedidoCard";
import { Pressable, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PedidosList() {
  const [data, setData] = useState([
    {
      id: 1,
      sincronizado: true,
      codigoCliente: "100001",
      condicionVenta: "Contado",
      estadoPedido: "Entregado",
      direccion: "Mariano Castex 3350",
      razonSocial: "Maximiliano Bisurgi",
    },
    {
      id: 2,
      sincronizado: false,
      codigoCliente: "100001",
      condicionVenta: "Contado",
      estadoPedido: "Pendiente",
      direccion: "Mariano Castex 3350",
      razonSocial: "Maximiliano Bisurgi",
    },
    {
      id: 3,
      sincronizado: false,
      codigoCliente: "100001",
      condicionVenta: "Contado",
      estadoPedido: "No Entregado",
      direccion: "Mariano Castex 3350",
      razonSocial: "Maximiliano Bisurgi",
    },
  ]);

  const renderItem = ({ item }) => {
    return (
      <PedidoCard
        id={item.id}
        direccion={item.direccion}
        razonSocial={item.razonSocial}
        sincronizado={item.sincronizado}
        estadoPedido={item.estadoPedido}
        codigoCliente={item.codigoCliente}
        condicionVenta={item.condicionVenta}
      />
    );
  };

  const renderHiddenItem = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SwipeListView
      data={data}
      leftOpenValue={50}
      disableLeftSwipe={true}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      keyExtractor={(item) => item.id.toString()}
      style={{ backgroundColor: "transparent", padding: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
}

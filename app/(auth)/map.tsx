import React, { useCallback, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "expo-router";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { Pedido } from "@/types/Pedido";
import PedidoRepository from "@/repositories/PedidoRepository";

const Map = () => {
  const { user } = useUser();
  const apiUrl = user?.publicMetadata.apiUrl as string;
  const choferId = user?.publicMetadata.choferId as number;
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function getPedidos() {
        const pedidosRepository = new PedidoRepository(apiUrl, choferId);
        const pedidos = await pedidosRepository.getPedidos();

        setPedidos(pedidos);
      }

      getPedidos();
    }, [])
  );

  const getInitialRegion = () => {
    const clientesGeolocalizados = pedidos.filter(
      (pedido) => pedido.cliente.latitud && pedido.cliente.longitud
    );
    if (clientesGeolocalizados.length > 0) {
      return {
        latitude: clientesGeolocalizados[0].cliente.latitud!,
        longitude: clientesGeolocalizados[0].cliente.longitud!,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    } else {
      return {
        latitude: -34.6137804,
        longitude: -58.3982147,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
  };

  const getColorPedido = (pedido: Pedido) => {
    if (pedido.estado === "Entregado") {
      return "#27ae60";
    }

    if (pedido.estado === "Pendiente") {
      return "#f39c12";
    }

    return "#e74c3c";
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MapView style={styles.map} region={getInitialRegion()}>
        {pedidos
          .filter((pedido) => pedido.cliente.latitud && pedido.cliente.longitud)
          .map((pedido) => (
            <Marker
              key={pedido.id}
              pinColor={getColorPedido(pedido)}
              title={pedido.cliente.razonSocial}
              coordinate={{
                latitude: pedido.cliente.latitud!,
                longitude: pedido.cliente.longitud!,
              }}
            />
          ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;

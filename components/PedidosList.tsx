import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { SwipeListView } from "react-native-swipe-list-view";
import { TouchableOpacity, View, RefreshControl } from "react-native";

import PedidoCard from "./PedidoCard";
import { Pedido } from "@/types/Pedido";
import PedidoRepository from "@/repositories/PedidoRepository";

export default function PedidosList() {
  const { user } = useUser();
  const apiUrl = user?.publicMetadata.apiUrl as string;
  const choferId = user?.publicMetadata.choferId as number;
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const getPedidosFromApi = async () => {
      const pedidosRepository = new PedidoRepository(apiUrl, choferId);
      const pedidos = await pedidosRepository.getPedidosFromApi();
      await pedidosRepository.setPedidos(pedidos);
      setPedidos(pedidos);
      setRefreshing(false);
    };

    getPedidosFromApi();
  }, []);

  const renderItem = ({ item }: { item: Pedido }) => {
    const { direccion, razonSocial, codigoCliente } = item.cliente;
    return (
      <PedidoCard
        id={item.id}
        direccion={direccion}
        razonSocial={razonSocial}
        isPedidoTelefonico={false}
        estadoPedido={item.estado}
        codigoCliente={codigoCliente}
        sincronizado={item.sincronizado}
        condicionVenta={item.condicionVenta}
        isReclamado={item.reclamo || !!item.observaciones}
      />
    );
  };

  const renderHiddenItem = ({ item }: { item: Pedido }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity onPress={() => onDeletePedido(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    );
  };

  const onDeletePedido = async (idPedido: number) => {
    const pedidosRepository = new PedidoRepository(apiUrl, choferId);
    await pedidosRepository.deletePedido(idPedido);
    setPedidos(pedidos.filter((pedido) => pedido.id !== idPedido));
  };

  return (
    <SwipeListView
      data={pedidos}
      leftOpenValue={50}
      disableLeftSwipe={true}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      contentContainerStyle={{ paddingBottom: 30 }}
      keyExtractor={(item) => item.id.toString()}
      style={{ backgroundColor: "transparent", padding: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

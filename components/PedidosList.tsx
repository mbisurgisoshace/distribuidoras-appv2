import {
  Radio,
  RadioIcon,
  RadioLabel,
  RadioGroup,
  RadioIndicator,
} from "@gluestack-ui/themed";
import { Circle } from "lucide-react-native";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import Toast from "react-native-toast-message";
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
  const [filter, setFilter] = useState<"todos" | "pendientes">("todos");

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
    const errors: string[] = [];
    const pedidosRepository = new PedidoRepository(apiUrl, choferId);

    const getPedidosFromApi = async () => {
      try {
        const pedidos = await pedidosRepository.getPedidosFromApi();
        await pedidosRepository.setPedidos(pedidos);
        setPedidos(pedidos);
      } catch (error: any) {
        errors.push(error.message);
      }
    };

    const uploadPedidosToApi = async () => {
      try {
        await pedidosRepository.uploadPedidosToApi();
        const pedidos = await pedidosRepository.getPedidos();
        setPedidos(pedidos);
      } catch (error: any) {
        errors.push(error.message);
      }
    };

    const syncData = async () => {
      await getPedidosFromApi();
      await uploadPedidosToApi();
      setRefreshing(false);
      if (errors.length > 0) {
        if (errors.length === 2) {
          Toast.show({
            type: "error",
            text1: "Hubo un error.",
            text2: "No se pudo enviar ni recibir pedidos",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Hubo un error.",
            text2: errors[0],
          });
        }
      } else {
        Toast.show({
          type: "success",
          text1: "Pedidos enviados y recibidos correctamente",
        });
      }
    };

    syncData();
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

  const getFilterPedidos = () => {
    if (filter === "todos") {
      return pedidos;
    }

    return pedidos.filter((pedido) => pedido.estado === "Pendiente");
  };

  return (
    <View>
      <RadioGroup
        value={filter}
        onChange={setFilter}
        style={{
          marginTop: 5,
          borderWidth: 1.5,
          borderRadius: 5,
          paddingVertical: 8,
          marginHorizontal: 16,
          paddingHorizontal: 16,
          flexDirection: "row",
          borderColor: "#6c47ff",

          justifyContent: "space-between",
        }}
      >
        <Radio value="todos" size="md">
          <RadioIndicator borderColor="#6c47ff">
            <RadioIcon
              as={() => (
                <Circle
                  size={10}
                  color="#6c47ff"
                  style={{ backgroundColor: "#6c47ff", borderRadius: 100 }}
                />
              )}
            />
          </RadioIndicator>
          <RadioLabel style={{ marginLeft: 10 }}>Todos</RadioLabel>
        </Radio>
        <Radio value="pendientes" size="md">
          <RadioIndicator borderColor="#6c47ff">
            <RadioIcon
              as={() => (
                <Circle
                  size={10}
                  color="#6c47ff"
                  style={{ backgroundColor: "#6c47ff", borderRadius: 100 }}
                />
              )}
            />
          </RadioIndicator>
          <RadioLabel style={{ marginLeft: 10 }}>Pendientes</RadioLabel>
        </Radio>
      </RadioGroup>
      <SwipeListView
        data={getFilterPedidos()}
        leftOpenValue={50}
        disableLeftSwipe={true}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        contentContainerStyle={{ paddingBottom: 70 }}
        keyExtractor={(item) => item.id.toString()}
        style={{ backgroundColor: "transparent", padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

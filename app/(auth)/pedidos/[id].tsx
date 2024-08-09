import {
  Plus,
  Home,
  Hash,
  User,
  Phone,
  CircleAlert,
  CircleDollarSign,
} from "lucide-react-native";
import uuid from "react-native-uuid";
import * as Linking from "expo-linking";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { Text, View, StyleSheet, Platform } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@gluestack-ui/themed";

import Card from "@/components/ui/Card";
import { Producto } from "@/types/Tablas";
import { Pedido as IPedido, PedidoItem } from "@/types/Pedido";
import PedidoField from "@/components/PedidoField";
import EditItemModal from "@/components/EditItemModal";
import PedidoRepository from "@/repositories/PedidoRepository";
import TablasRepository from "@/repositories/TablasRepository";
import PedidoItemsList from "@/components/PedidoItemsList";
import NoEntregadoModal from "@/components/NoEntregadoModal";

const Pedido = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const apiUrl = user?.publicMetadata.apiUrl as string;
  const choferId = user?.publicMetadata.choferId as number;
  const [showItemModal, setShowItemModal] = useState(false);
  const [pedido, setPedido] = useState<IPedido | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showNoEntregadoModal, setShowNoEntregadoModal] = useState(false);
  const [editableItem, setEditableItem] = useState<PedidoItem | null>(null);

  useEffect(() => {
    const getPedido = async () => {
      const pedidoRepository = new PedidoRepository(apiUrl, choferId);
      const pedido = await pedidoRepository.getPedido(parseInt(id as string));
      setPedido(pedido);
    };
    getPedido();
  }, []);

  useEffect(() => {
    async function getProductos() {
      const tablasRepository = new TablasRepository(apiUrl);
      const tablaProductos = await tablasRepository.getProductos();
      setProductos(tablaProductos.productos);
    }

    getProductos();
  }, []);

  const onAddItem = (idProducto: number, cantidad: number) => {
    const precios = pedido!.cliente.precios;
    const precioProducto = precios.find((p) => p.idProducto === idProducto);

    if (editableItem) {
      setPedido((prevPedido) => {
        if (!prevPedido) return null;
        return {
          ...prevPedido,
          items: prevPedido.items.map((item) => {
            if (item.id === editableItem.id) {
              return {
                ...item,
                idProducto,
                cantidad,
                precio: precioProducto?.precio || 0,
              };
            }
            return item;
          }),
        };
      });

      return;
    }

    const itemPedido: PedidoItem = {
      id: uuid.v4().toString(),
      idProducto,
      cantidad,
      precio: precioProducto?.precio || 0,
    };

    setPedido((prevPedido) => {
      if (!prevPedido) return null;
      return {
        ...prevPedido,
        items: [...prevPedido.items, itemPedido],
      };
    });
  };

  const onSelectItemToEdit = (idItem: string) => {
    const item = pedido?.items.find((item) => item.id === idItem);
    if (!item) return;

    setEditableItem(item);
  };

  const onDeleteItem = (idItem: string) => {
    setPedido((prevPedido) => {
      if (!prevPedido) return null;
      return {
        ...prevPedido,
        items: prevPedido.items.filter((item) => item.id !== idItem),
      };
    });
  };

  const onEntregarPedido = async () => {
    if (!pedido) return;

    pedido.idEstado = 3;
    pedido.vendio = true;
    pedido.visito = true;
    pedido.sincronizado = false;
    pedido.estado = "Entregado";

    const pedidoRepository = new PedidoRepository(apiUrl, choferId);
    await pedidoRepository.updatePedido(pedido);

    navigation.goBack();
  };

  const onNoEntregarPedido = async () => {
    if (!pedido) return;

    setShowNoEntregadoModal(true);
  };

  const onConfirmarNoEntregado = async (idMotivo: number, visito: boolean) => {
    if (!pedido) return;

    pedido.idEstado = 4;
    pedido.vendio = false;
    pedido.visito = visito;
    pedido.idMotivo = idMotivo;
    pedido.sincronizado = false;
    pedido.estado = "No Entregado";

    const pedidoRepository = new PedidoRepository(apiUrl, choferId);
    await pedidoRepository.updatePedido(pedido);

    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: `Pedido ${id}`,
          headerRight: () =>
            pedido?.reclamo || !!pedido?.observaciones ? (
              <CircleAlert color={"#e74c3c"} />
            ) : null,
        }}
      />
      {pedido && (
        <View style={{ flex: 1, gap: 10, padding: 10 }}>
          <Card backgroundColor="rgba(108, 71, 255, 0.1)">
            <View style={{ gap: 10 }}>
              <PedidoField
                value={pedido.cliente.codigoCliente}
                icon={<Hash color={"#6c47ff"} size={16} />}
              />
              <PedidoField
                value={pedido.cliente.razonSocial}
                icon={<User color={"#6c47ff"} size={16} />}
              />
              <PedidoField
                value={pedido.cliente.direccion}
                icon={<Home color={"#6c47ff"} size={16} />}
              />
              <View style={styles.wrapperCampo}>
                <Phone color={"#6c47ff"} size={16} />
                <Text
                  style={styles.telefono}
                  onPress={() =>
                    Linking.openURL(`tel:${pedido.cliente.telefono}`)
                  }
                >
                  {pedido.cliente.telefono}
                </Text>
              </View>
            </View>
          </Card>

          <Card>
            <View style={{ gap: 10 }}>
              <PedidoField
                value={pedido.condicionVenta}
                icon={<CircleDollarSign color={"#6c47ff"} size={16} />}
              />
              <PedidoField
                textColor="#e74c3c"
                value={pedido.observaciones || ""}
                icon={<CircleAlert color={"#e74c3c"} size={16} />}
              />
            </View>
          </Card>

          <Button
            size="md"
            bgColor="#6c47ff"
            style={{ marginBottom: 0 }}
            onPress={() => setShowItemModal(true)}
          >
            <ButtonText>Agregar</ButtonText>
            <ButtonIcon as={Plus} style={{ marginLeft: 10 }} />
          </Button>

          {productos.length > 0 && (
            <PedidoItemsList
              items={pedido.items}
              productos={productos}
              onDeleteItem={onDeleteItem}
              onEditItem={onSelectItemToEdit}
            />
          )}

          <View
            style={{
              gap: 10,
              marginTop: "auto",
              flexDirection: "row",
              marginBottom: Platform.OS === "ios" ? 30 : 0,
            }}
          >
            <Button
              size="lg"
              style={{ flex: 1 }}
              onPress={onEntregarPedido}
              disabled={pedido.items.length === 0}
              bgColor={pedido.items.length === 0 ? "grey" : "#27ae60"}
            >
              <ButtonText>Entregar</ButtonText>
            </Button>
            <Button
              size="lg"
              bgColor="#e74c3c"
              style={{ flex: 1 }}
              onPress={onNoEntregarPedido}
            >
              <ButtonText>No Entregado</ButtonText>
            </Button>
          </View>
        </View>
      )}
      {showItemModal ||
        (editableItem && (
          <EditItemModal
            onAddItem={onAddItem}
            itemPedido={editableItem}
            onClose={() => {
              setEditableItem(null);
              setShowItemModal(false);
            }}
          />
        ))}
      {showNoEntregadoModal && (
        <NoEntregadoModal
          onClose={() => setShowNoEntregadoModal(false)}
          onConfirmarNoEntregado={onConfirmarNoEntregado}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  campoValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  telefono: {
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "italic",
    textDecorationColor: "#6c47ff",
    textDecorationLine: "underline",
  },
  wrapperCampo: {
    gap: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Pedido;

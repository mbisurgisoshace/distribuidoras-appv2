import {
  Plus,
  Home,
  Hash,
  User,
  Phone,
  CircleAlert,
  CircleDollarSign,
} from "lucide-react-native";
import * as Linking from "expo-linking";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Text, View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Button, ButtonText, ButtonIcon } from "@gluestack-ui/themed";

import Card from "@/components/ui/Card";
import { Pedido as IPedido } from "@/types/Pedido";
import PedidoRepository from "@/repositories/PedidoRepository";
import EditItemModal from "@/components/EditItemModal";

const Pedido = () => {
  const { user } = useUser();
  const { id } = useLocalSearchParams();
  const apiUrl = user?.publicMetadata.apiUrl as string;
  const choferId = user?.publicMetadata.choferId as number;
  const [showItemModal, setShowItemModal] = useState(false);
  const [pedido, setPedido] = useState<IPedido | null>(null);

  useEffect(() => {
    const getPedido = async () => {
      const pedidoRepository = new PedidoRepository(apiUrl, choferId);
      const pedido = await pedidoRepository.getPedido(parseInt(id as string));
      setPedido(pedido);
    };
    getPedido();
  }, []);

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
              <View style={styles.wrapperCampo}>
                <Hash color={"#6c47ff"} size={16} />
                <Text style={styles.campoValue}>
                  {pedido.cliente.codigoCliente}
                </Text>
              </View>
              <View style={styles.wrapperCampo}>
                <User color={"#6c47ff"} size={16} />
                <Text
                  style={styles.campoValue}
                >{`${pedido.cliente.razonSocial}`}</Text>
              </View>
              <View style={styles.wrapperCampo}>
                <Home color={"#6c47ff"} size={16} />
                <Text style={styles.campoValue}>
                  {pedido.cliente.direccion}
                </Text>
              </View>
              <View style={styles.wrapperCampo}>
                <Phone color={"#6c47ff"} size={16} />
                <Text
                  style={styles.telefono}
                  onPress={() => Linking.openURL(`tel:${42959090}`)}
                >
                  {"42959090"}
                </Text>
              </View>
            </View>
          </Card>
          <Card>
            <View style={{ gap: 10 }}>
              <View style={styles.wrapperCampo}>
                <CircleDollarSign color={"#6c47ff"} size={16} />
                <Text style={styles.campoValue}>{pedido.condicionVenta}</Text>
              </View>
              <View style={styles.wrapperCampo}>
                <CircleAlert color={"#e74c3c"} size={16} />
                <Text style={{ ...styles.campoValue, color: "#e74c3c" }}>
                  {"Observacion del pedido bla bla bla asdasdasdasdasdasdas"}
                </Text>
              </View>
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
          <View
            style={{
              gap: 10,
              marginBottom: 30,
              marginTop: "auto",
              flexDirection: "row",
            }}
          >
            <Button
              size="lg"
              bgColor="#27ae60"
              onPress={() => {}}
              style={{ flex: 1 }}
            >
              <ButtonText>Entregar</ButtonText>
            </Button>
            <Button
              size="lg"
              bgColor="#e74c3c"
              onPress={() => {}}
              style={{ flex: 1 }}
            >
              <ButtonText>No Entregado</ButtonText>
            </Button>
          </View>
        </View>
      )}
      {showItemModal && (
        <EditItemModal onClose={() => setShowItemModal(false)} />
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

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Badge, BadgeText } from "@gluestack-ui/themed";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import Card from "./ui/Card";
import { EstadoPedido } from "@/types/Pedido";

interface PedidoCardProps {
  id: number;
  direccion: string;
  razonSocial: string;
  sincronizado: boolean;
  codigoCliente: string;
  condicionVenta: string;
  estadoPedido: EstadoPedido;
}

export default function PedidoCard({
  id,
  direccion,
  razonSocial,
  estadoPedido,
  sincronizado,
  codigoCliente,
  condicionVenta,
}: PedidoCardProps) {
  return (
    <Card>
      <TouchableOpacity
        onPress={() => {
          router.navigate(`/pedidos/${id}`);
        }}
      >
        <View style={styles.container}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={styles.razonSocial}
            >{`${codigoCliente} - ${razonSocial}`}</Text>
            <Ionicons
              name="cloud-upload-outline"
              size={18}
              color={sincronizado ? "#2ecc71" : "#e74c3c"}
            />
          </View>
          <View>
            <Text style={styles.direccion}>{direccion}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.condicionVenta}>{condicionVenta}</Text>
            <Badge
              size="md"
              variant="solid"
              borderRadius="$md"
              action={
                estadoPedido === "Entregado"
                  ? "success"
                  : estadoPedido === "No Entregado"
                  ? "error"
                  : "warning"
              }
            >
              <BadgeText style={styles.estadoPedido}>{estadoPedido}</BadgeText>
            </Badge>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  razonSocial: {
    fontSize: 16,
    fontWeight: "700",
  },
  direccion: {
    fontSize: 14,
    color: "gray",
    fontWeight: "500",
  },
  condicionVenta: {
    fontSize: 15,
    color: "#6c47ff",
    fontWeight: "500",
  },
  estadoPedido: {
    fontSize: 12,
    fontWeight: "500",
  },
});

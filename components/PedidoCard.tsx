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
  isReclamado: boolean;
  sincronizado: boolean;
  codigoCliente: string;
  condicionVenta: string;
  estadoPedido: EstadoPedido;
  isPedidoTelefonico: boolean;
}

export default function PedidoCard({
  id,
  direccion,
  isReclamado,
  razonSocial,
  estadoPedido,
  sincronizado,
  codigoCliente,
  condicionVenta,
  isPedidoTelefonico,
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
              style={[styles.codigo, isReclamado ? styles.reclamado : {}]}
            >{`${codigoCliente}`}</Text>
            <Ionicons
              name="cloud-upload-outline"
              size={18}
              color={sincronizado ? "#2ecc71" : "#e74c3c"}
            />
          </View>
          <Text style={[styles.razonSocial]}>{`${razonSocial}`}</Text>
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
  codigo: {
    fontSize: 14,
    color: "gray",
    fontWeight: "600",
  },
  razonSocial: {
    fontSize: 16,
    fontWeight: "700",
  },
  reclamado: {
    color: "#e74c3c",
  },
  direccion: {
    height: 40,
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

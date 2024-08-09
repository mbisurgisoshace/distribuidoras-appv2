import numeral from "numeral";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import Card from "./ui/Card";
import { Producto } from "@/types/Tablas";
import { PedidoItem } from "@/types/Pedido";

interface PedidoItemsListProps {
  items: PedidoItem[];
  productos: Producto[];
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export default function PedidoItemsList({
  items,
  productos,
  onEditItem,
  onDeleteItem,
}: PedidoItemsListProps) {
  const renderItem = ({ item }: { item: PedidoItem }) => {
    const producto = productos.find(
      (p) => p.id === item.idProducto
    ) as Producto;

    return (
      <Card size="small">
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{ flex: 1 }}
          >{`${producto.codigo} - ${producto.descripcion}`}</Text>
          <Text style={{ flex: 0.25 }}>{`${item.cantidad}`}</Text>
          <Text style={{ flex: 0.5 }}>{`${numeral(item.precio).format(
            "$0.0,"
          )}`}</Text>
        </View>
      </Card>
    );
  };

  const renderHiddenItem = ({ item }: { item: PedidoItem }) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => onDeleteItem(item.id)}
          style={{ left: 0, position: "absolute" }}
        >
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onEditItem(item.id)}
          style={{ right: 0, position: "absolute" }}
        >
          <Ionicons name="pencil-outline" size={20} color="#6c47ff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SwipeListView
      data={items}
      leftOpenValue={35}
      rightOpenValue={-35}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      contentContainerStyle={{ paddingBottom: 15 }}
      style={{ backgroundColor: "transparent", padding: 10 }}
      ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
    />
  );
}

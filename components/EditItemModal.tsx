import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Button, ButtonText, ButtonIcon } from "@gluestack-ui/themed";

import Input from "./ui/Input";
import { Producto } from "@/types/Tablas";
import TablasRepository from "@/repositories/TablasRepository";
import { PedidoItem } from "@/types/Pedido";

interface EditItemModalProps {
  onClose: () => void;
  itemPedido?: PedidoItem;
  onAddItem: (idProducto: number, cantidad: number) => void;
}

export default function EditItemModal({
  onClose,
  onAddItem,
  itemPedido,
}: EditItemModalProps) {
  const { user } = useUser();
  const apiUrl = user?.publicMetadata.apiUrl as string;
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cantidad, setCantidad] = useState(
    itemPedido?.cantidad.toString() || ""
  );
  const [selectedProducto, setSelectedProducto] = useState(
    itemPedido?.idProducto || null
  );

  useEffect(() => {
    async function getProductos() {
      const tablasRepository = new TablasRepository(apiUrl);
      const tablaProductos = await tablasRepository.getProductos();
      setProductos(tablaProductos.productos);
    }

    getProductos();
  }, []);

  const isAgregarDisabled = !selectedProducto || !cantidad;

  return (
    <View style={styles.backdrop}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Agregar / Editar item</Text>
        </View>
        <View style={styles.modalBody}>
          <RNPickerSelect
            value={selectedProducto}
            onValueChange={(value) => setSelectedProducto(value)}
            items={productos.map((producto) => ({
              key: producto.id,
              value: producto.id,
              label: `${producto.codigo} - ${producto.descripcion}`,
            }))}
            placeholder={{ label: "Seleccione un producto", value: null }}
            style={{
              inputIOS: {
                height: 50,
                padding: 10,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 4,
                borderColor: "#6c47ff",
                backgroundColor: "#fff",
              },
              inputAndroid: {
                height: 50,
                padding: 10,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 4,
                borderColor: "#6c47ff",
                backgroundColor: "#fff",
              },
            }}
          />
          <Input
            value={cantidad}
            onChange={setCantidad}
            placeholder="Cantidad"
            keyboardType="numbers-and-punctuation"
          />
          <View style={styles.modalFormFooter}>
            <Button
              size="md"
              style={{ flex: 1 }}
              disabled={isAgregarDisabled}
              onPress={() => {
                onAddItem(selectedProducto!, parseInt(cantidad));
                onClose();
              }}
              bgColor={isAgregarDisabled ? "grey" : "#27ae60"}
            >
              <ButtonText>{itemPedido ? "Editar" : "Agregar"}</ButtonText>
            </Button>
            <Button
              size="md"
              style={{
                flex: 1,
              }}
              bgColor="#e74c3c"
              onPress={onClose}
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 50,
    position: "absolute",
    paddingHorizontal: 30,
    justifyContent: "center",
    backgroundColor: "rgba(24,23,25, 0.80)",
  },
  modalContainer: {
    //flex: 1,
    padding: 20,
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 6,
    shadowOpacity: 0.3,
    shadowColor: "black",
    backgroundColor: "white",
  },
  modalHeader: {
    display: "flex",
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 20,
    color: "#6c47ff",
    fontWeight: "bold",
  },
  modalBody: {},
  modalFormFooter: {
    gap: 10,
    marginTop: 15,
    flexDirection: "row",
  },
});

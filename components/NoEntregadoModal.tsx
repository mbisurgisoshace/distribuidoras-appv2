import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { View, StyleSheet, Text, Switch } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@gluestack-ui/themed";

import Input from "./ui/Input";
import { Motivo, Producto } from "@/types/Tablas";
import TablasRepository from "@/repositories/TablasRepository";
import { PedidoItem } from "@/types/Pedido";

interface NoEntregadoModalProps {
  onClose: () => void;
  onConfirmarNoEntregado: (idProducto: number, visito: boolean) => void;
}

export default function NoEntregadoModal({
  onClose,
  onConfirmarNoEntregado,
}: NoEntregadoModalProps) {
  const { user } = useUser();
  const apiUrl = user?.publicMetadata.apiUrl as string;
  const [motivos, setMotivos] = useState<Motivo[]>([]);
  const [visito, setVisito] = useState(false);
  const [selectedMotivo, setSelectedMotivo] = useState();

  useEffect(() => {
    async function getMotivos() {
      const tablasRepository = new TablasRepository(apiUrl);
      const tablaMotivos = await tablasRepository.getMotivos();
      setMotivos(tablaMotivos.motivos);
    }

    getMotivos();
  }, []);

  const isConfirmarDisabled = !selectedMotivo;

  return (
    <View style={styles.backdrop}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Motivo de no entrega</Text>
        </View>
        <View style={styles.modalBody}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 500 }}>Visito?</Text>
            <Switch
              value={visito}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setVisito(!visito)}
              thumbColor={visito ? "#6c47ff" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#d5cafd" }}
            />
          </View>
          <RNPickerSelect
            value={selectedMotivo}
            onValueChange={(value) => setSelectedMotivo(value)}
            items={motivos.map((motivo) => ({
              key: motivo.id,
              value: motivo.id,
              label: `${motivo.descripcion}`,
            }))}
            placeholder={{ label: "Seleccione un motivo", value: null }}
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

          <View style={styles.modalFormFooter}>
            <Button
              size="md"
              style={{ flex: 1 }}
              disabled={isConfirmarDisabled}
              onPress={() => {
                onConfirmarNoEntregado(selectedMotivo!, visito);
                onClose();
              }}
              bgColor={isConfirmarDisabled ? "grey" : "#27ae60"}
            >
              <ButtonText>Confirmar</ButtonText>
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
  modalBody: {
    alignItems: "flex-start",
  },
  modalFormFooter: {
    gap: 10,
    marginTop: 15,
    flexDirection: "row",
  },
});

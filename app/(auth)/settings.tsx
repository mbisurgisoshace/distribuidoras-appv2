import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useCallback, useEffect, useState } from "react";

import TablasRepository, {
  TablaMotivo,
  TablaProducto,
} from "@/repositories/TablasRepository";
import SettingItem from "@/components/SettingItem";
import { Button, ButtonText } from "@gluestack-ui/themed";
import PedidoRepository from "@/repositories/PedidoRepository";

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const apiUrl = user?.publicMetadata.apiUrl as string;
  const choferId = user?.publicMetadata.choferId as number;
  const [tablaMotivos, setTablaMotivos] = useState<TablaMotivo>();
  const [tablaProductos, setTablaProductos] = useState<TablaProducto>();

  useFocusEffect(
    useCallback(() => {
      async function getTablas() {
        const tablasRepository = new TablasRepository(apiUrl);
        const motivos = await tablasRepository.getMotivos();
        const productos = await tablasRepository.getProductos();
        setTablaMotivos(motivos);
        setTablaProductos(productos);
      }

      getTablas();
    }, [])
  );

  const actualizarMotivos = async () => {
    const tablasRepository = new TablasRepository(apiUrl);
    const motivos = await tablasRepository.getMotivosFromApi();
    const tablaMotivos = await tablasRepository.setMotivos(motivos);
    setTablaMotivos(tablaMotivos);
  };

  const actualizarProductos = async () => {
    const tablasRepository = new TablasRepository(apiUrl);
    const productos = await tablasRepository.getProductosFromApi();
    const tablaProductos = await tablasRepository.setProductos(productos);
    setTablaProductos(tablaProductos);
  };

  const onSignOut = async () => {
    const pedidosRepository = new PedidoRepository(apiUrl, choferId);
    await pedidosRepository.deleteAllPedidos();
    signOut();
  };

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <View>
        <SettingItem
          title="Motivos"
          actualizar={actualizarMotivos}
          ultimaActualizacion={tablaMotivos?.fechaActualizacion || ""}
        />
        <SettingItem
          title="Productos"
          actualizar={actualizarProductos}
          ultimaActualizacion={tablaProductos?.fechaActualizacion || ""}
        />
      </View>

      <Button
        size="md"
        bgColor="#6c47ff"
        onPress={onSignOut}
        style={{ margin: 10 }}
      >
        <ButtonText>Cerrar Sesion </ButtonText>
      </Button>
    </View>
  );
};

export default Settings;

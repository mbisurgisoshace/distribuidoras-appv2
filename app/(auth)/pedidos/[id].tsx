import { Text, View } from "react-native";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { CheckCheck } from "lucide-react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Button, ButtonText, ButtonIcon } from "@gluestack-ui/themed";

import { Pedido as IPedido } from "@/types/Pedido";
import PedidoRepository from "@/repositories/PedidoRepository";

const Pedido = () => {
  const { user } = useUser();
  const { id } = useLocalSearchParams();
  const apiUrl = user?.publicMetadata.apiUrl as string;
  const choferId = user?.publicMetadata.choferId as number;
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
    <View>
      <Stack.Screen
        options={{
          title: `Pedido ${id}`,
          headerRight: () => (
            <Button size="xs" action="positive" style={{ borderRadius: 5 }}>
              <ButtonText>Grabar</ButtonText>
              <ButtonIcon as={CheckCheck} style={{ marginLeft: 5 }} />
            </Button>
          ),
        }}
      />
      <Text>{`Pedido ${id}`}</Text>
    </View>
  );
};

export default Pedido;

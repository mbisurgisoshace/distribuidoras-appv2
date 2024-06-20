import { Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

const Pedido = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Stack.Screen
        options={{
          title: `Pedido ${id}`,
        }}
      />
      <Text>{`Pedido ${id}`}</Text>
    </View>
  );
};

export default Pedido;

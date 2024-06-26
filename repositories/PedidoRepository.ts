import { Pedido } from "@/types/Pedido";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class PedidoRepository {
  async getPedido(id: number): Promise<Pedido> {
    const jsonData = await AsyncStorage.getItem(id.toString());
    return JSON.parse(jsonData!) as Pedido;
  }

  async getPedidos(): Promise<Pedido[]> {
    const keys = await AsyncStorage.getAllKeys();
    const jsonData = await AsyncStorage.multiGet(
      keys.filter((key) => !key.includes("tablas"))
    );
    return jsonData.map((item) => JSON.parse(item[1]!) as Pedido);
  }
}

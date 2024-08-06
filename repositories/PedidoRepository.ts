import { Pedido } from "@/types/Pedido";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class PedidoRepository {
  constructor(private apiUrl: string, private choferId: number) {}

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

  async setPedidos(pedidos: Pedido[]): Promise<void> {
    await AsyncStorage.multiSet(
      pedidos.map((pedido) => [pedido.id.toString(), JSON.stringify(pedido)])
    );
  }

  async getPedidosFromApi(): Promise<Pedido[]> {
    try {
      // TODO: Logica para solo agregar los pedidos nuevos, y respetar los que ya estan en la aplicacion.
      // La fuente de verdad de los datos es la app, ante una inconsistencia prevalece la informacion de la app.
      const response = await fetch(
        `${this.apiUrl}/mobile/${this.choferId}/pedidos`
      );
      const data = await response.json();

      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}

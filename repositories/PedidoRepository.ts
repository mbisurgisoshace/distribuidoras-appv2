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

  async updatePedido(pedido: Pedido): Promise<void> {
    await AsyncStorage.setItem(pedido.id.toString(), JSON.stringify(pedido));
  }

  async deletePedido(id: number): Promise<void> {
    await AsyncStorage.removeItem(id.toString());
  }

  async deleteAllPedidos(): Promise<void> {
    const keys = (await AsyncStorage.getAllKeys()).filter(
      (key) => !key.includes("tablas")
    );
    await AsyncStorage.multiRemove(keys);
  }

  async getPedidosFromApi(): Promise<Pedido[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/mobile/${this.choferId}/pedidos`
      );

      const data = await response.json();
      const pedidos = await this.getPedidos();

      data.forEach((pedido: Pedido) => {
        if (!pedidos.map((pedido) => pedido.id).includes(pedido.id)) {
          pedidos.push(pedido);
        }
      });

      return pedidos;
    } catch (err) {
      console.log(err);
      throw new Error("Error al obtener pedidos.");
    }
  }

  async uploadPedidosToApi(): Promise<void> {
    try {
      const pedidos = await this.getPedidos();
      const pedidosParaSincronizar = pedidos.filter(
        (pedido) => pedido.sincronizado === false
      );

      const response = await fetch(
        `${this.apiUrl}/mobile/${this.choferId}/pedidos`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pedidosParaSincronizar),
        }
      );

      if (response.ok) {
        pedidos.forEach((pedido) => {
          if (
            pedidosParaSincronizar
              .map((pedido) => pedido.id)
              .includes(pedido.id)
          ) {
            pedido.sincronizado = true;
          }
        });
        await this.setPedidos(pedidos);
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error al enviar pedidos.");
    }
  }
}

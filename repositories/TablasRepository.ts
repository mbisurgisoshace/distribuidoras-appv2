import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Motivo, Producto } from "@/types/Tablas";

export type TablaMotivo = {
  motivos: Motivo[];
  fechaActualizacion: string;
};

export type TablaProducto = {
  productos: Producto[];
  fechaActualizacion: string;
};

export default class TablasRepository {
  private tablasKey = "tablas";

  async setMotivos(motivos: Motivo[]): Promise<TablaMotivo> {
    const tablaMotivo = {
      motivos,
      fechaActualizacion: format(new Date(), "dd/MM/yyyy hh:mm"),
    };
    await AsyncStorage.setItem(
      `${this.tablasKey}.motivos`,
      JSON.stringify(tablaMotivo)
    );
    return tablaMotivo;
  }

  async getMotivos(): Promise<TablaMotivo> {
    const jsonData = await AsyncStorage.getItem(`${this.tablasKey}.motivos`);
    return JSON.parse(jsonData || "{}") as TablaMotivo;
  }

  async setProductos(productos: Producto[]): Promise<TablaProducto> {
    const tablaProducto = {
      productos,
      fechaActualizacion: format(new Date(), "dd/MM/yyyy hh:mm"),
    };
    await AsyncStorage.setItem(
      `${this.tablasKey}.productos`,
      JSON.stringify(tablaProducto)
    );
    return tablaProducto;
  }

  async getProductos(): Promise<TablaProducto> {
    const jsonData = await AsyncStorage.getItem(`${this.tablasKey}.productos`);
    return JSON.parse(jsonData || "{}") as TablaProducto;
  }

  async getMotivosFromApi(): Promise<Motivo[]> {
    // TODO: Implementar llamada a la API
    return [
      { id: 1, descripcion: "Cerrado" },
      { id: 2, descripcion: "Completo" },
      { id: 4, descripcion: "Por precio" },
      { id: 3, descripcion: "No vende mas" },
    ];
  }

  async getProductosFromApi(): Promise<Producto[]> {
    // TODO: Implementar llamada a la API
    return [
      { id: 1, descripcion: "Garrafa 10kg", codigo: "1001", kilos: 10 },
      { id: 3, descripcion: "Garrafa 15kg", codigo: "1002", kilos: 15 },
    ];
  }
}

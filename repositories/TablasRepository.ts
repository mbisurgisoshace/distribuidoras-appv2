import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Motivo, MotivoCrm, Producto, ProductoCrm } from "@/types/Tablas";

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

  constructor(private apiUrl: string) {}

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
    try {
      const response = await fetch(`${this.apiUrl}/mobile/motivos`);
      const data: MotivoCrm[] = await response.json();

      return data.map((motivo) => ({
        id: motivo.motivo_id,
        descripcion: motivo.motivo_nombre,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      return [];
    }
  }

  async getProductosFromApi(): Promise<Producto[]> {
    try {
      const response = await fetch(`${this.apiUrl}/mobile/productos`);
      const data: ProductoCrm[] = await response.json();
      console.log(data);
      return data.map((producto) => ({
        id: producto.envase_id,
        descripcion: producto.envase_nombre,
        codigo: producto.envase_codigo.toString(),
        kilos: producto.kilos,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      return [];
    }
  }
}

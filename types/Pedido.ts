export type EstadoPedido = "Pendiente" | "Entregado" | "No Entregado";

interface Precio {
  idProducto: number;
  precio: number;
}
interface Cliente {
  id: number;
  latitud?: number;
  longitud?: number;
  telefono: string;
  codigoCliente: string;
  razonSocial: string;
  direccion: string;
  precios: Precio[];
}

export interface Pedido {
  id: number;
  cliente: Cliente;
  idCondicionVenta: number;
  condicionVenta: string;
  idEstado: number;
  idMotivo: number;
  estado: EstadoPedido;
  items: PedidoItem[];
  visito: boolean;
  vendio: boolean;
  reclamo: boolean;
  orden: number;
  observaciones?: string;
  sincronizado?: boolean;
}

export interface PedidoItem {
  id: string;
  idProducto: number;
  cantidad: number;
  precio: number;
}

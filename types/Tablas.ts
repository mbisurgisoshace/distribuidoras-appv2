export interface Motivo {
  id: number;
  descripcion: string;
}

export interface Producto {
  id: number;
  descripcion: string;
  codigo: string;
  kilos: number;
}

export interface MotivoCrm {
  motivo_id: number;
  motivo_nombre: string;
}

export interface ProductoCrm {
  envase_id: number;
  envase_codigo: number;
  envase_nombre: string;
  kilos: number;
}

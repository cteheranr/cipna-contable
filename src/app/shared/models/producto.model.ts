import { EstadoEntrega } from "./enums";

export interface Producto {
  id?: string;
  categoria: string;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
}

export interface PedidosUniforme {
  categoria: string;
  nombre: string;
  precio: number;
  cantidad: number;
  total: number;
  stock: number;
  estadoEntrega: EstadoEntrega;
}

export interface Pedido {
  id?: string;
  estudiante: string;
  categoria: string;
  items: PedidosUniforme[];
  total: number;
  abono: Abono[];
  abonoTotal: number;
  saldo: number;
  fecha: string;
  estadoPago: string;
}

export interface Abono {
  monto: number;
  metodoPago: string;
  numeroComprobante: string;
  fecha: string;
} 
import { EstadoEntrega } from "./enums";
import { Metodos } from "./metodos.model";

export interface Producto {
  id?: string;
  categoria: string;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
}

export interface PedidosItem {
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
  items: PedidosItem[];
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

export interface PedidoLibro {
  id?: string;
  estudiante: string;
  categoria: string;
  items: PedidosItem[];
  total: number;
  abonoTotal: number;
  metodoDePago: Metodos[];
  fecha: string;
}
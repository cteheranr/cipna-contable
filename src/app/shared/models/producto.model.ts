import { TipoProducto } from './enums';

export interface Producto {
  id?: string;
  categoria: string;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
}

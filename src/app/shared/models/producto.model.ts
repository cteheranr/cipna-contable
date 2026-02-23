import { TipoProducto } from './enums';

export interface Producto {
  id: string;
  tipo: TipoProducto;

  nombre: string;

  precioBase: number;

  activo: boolean;
}

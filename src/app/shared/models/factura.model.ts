import { MetodoPago } from './enums';

export interface Factura {
  id: string;
  numero: string;

  fecha: Date;

  estudianteId?: string;

  subtotal: number;
  iva: number;
  total: number;

  metodoPago: MetodoPago;

  usuarioCajaId: string;

  anulada: boolean;
}

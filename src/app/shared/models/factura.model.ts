import { MetodoPago } from './enums';

export interface Factura {
  id: string;
  fecha: string;
  estudianteDoc: string;
  estudiante: string;
  concepto: string;
  monto: number;
  metodo: string;
  notas: string;
  numeroAprobacion: string;
  metodo1: string,
  monto1: number,
  numeroAprobacion1: string,
  metodo2: string,
  monto2: number,
  numeroAprobacion2: string,
  metodo3: string,
  monto3: number,
  numeroAprobacion3: string,
  usuario: string,
}
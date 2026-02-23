import { EstadoCuota } from './enums';

export interface CuotaPension {
  id: string;
  matriculaId: string;

  mes: number;
  anio: number;

  valorBase: number;
  valorInteres: number;
  valorTotal: number;

  fechaLimitePago: Date;

  estado: EstadoCuota;

  fechaPago?: Date;
  facturaId?: string;
}

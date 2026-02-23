import { TipoDocumento } from "./enums";

export interface Estudiante {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string | number;
  nombres: string;
  apellidos: string;
  telefono?: number | null;
  email?: string | null;
}

export interface Exalumno {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
}

export interface Externo {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
}


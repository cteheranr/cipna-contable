export interface ExcepcionMora {
  id: string;
  matriculaId: string;

  fechaLimiteEspecial?: Date;
  diasGraciaEspecial?: number;
  porcentajeEspecial?: number;

  motivo: string;
  activo: boolean;
}

export interface PlanPension {
  id: string;
  anioLectivoId: string;
  gradoId: string;

  mesInicio: number;
  mesFin: number;

  valorMensual: number;

  diasGraciaMora: number;
  porcentajeInteresMora: number;

  interesTipo: 'PORCENTAJE' | 'VALOR_FIJO';

  activo: boolean;
}

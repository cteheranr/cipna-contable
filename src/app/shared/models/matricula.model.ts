export interface Matricula {
  id: string;
  estudianteId: string;
  gradoId: string;
  anioLectivoId: string;
  fechaMatricula: Date;
  valorMatricula?: number;
  observaciones?: string;
}

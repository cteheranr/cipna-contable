export interface Grado {
  id: string;
  nombre: string;
  nivel: 'PREESCOLAR' | 'PRIMARIA' | 'SECUNDARIA' | 'MEDIA';
  orden: number;
}

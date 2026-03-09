export interface FacturaDetalle {
  id: string;
  facturaId: string;

  productoId?: string;

  descripcion: string;

  cantidad: number;
  valorUnitario: number;
  totalLinea: number;

  cuotaPensionId?: string; // si aplica a pensión
}

export interface FacturaReport {
  FechaGeneracion: string, 
  fechaConsultada: string, 
  totalVendido:  number
}

export enum EstadoCuota {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  VENCIDO = 'VENCIDO'
}

export enum TipoProducto {
  PRODUCTO = 'PRODUCTO',
  SERVICIO = 'SERVICIO'
}

export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  TARJETA = 'TARJETA',
  MIXTO = 'MIXTO'
}

export enum RolUsuario {
  ADMIN = 'ADMIN',
  SECRETARIA = 'SECRETARIA',
  CAJA = 'CAJA',
  RECTORIA = 'RECTORIA'
}

export enum TipoDocumento {
  TI = 'TI',
  RC = 'RC',
  CC = 'CC',
  PPT = 'PPT',
  PAS = 'PAS',
  OTRO = 'OTRO'
}

export enum EstadoEntrega {
  ENTREGADO = 'Entregado',
  PENDIENTE = 'Pendiente'
}
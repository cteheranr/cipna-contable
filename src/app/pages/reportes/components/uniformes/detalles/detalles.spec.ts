import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { Detalles } from './detalles';
import { NotificationService } from '../../../../../service/notificaciones/notificaciones';
import { PedidosService } from '../../../../../service/PedidosUniformes/pedidosUnSrv';
import { Pedido } from '../../../../../shared/models/producto.model';

describe('Detalles', () => {
  let component: Detalles;
  let fixture: ComponentFixture<Detalles>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockPedidosService: jasmine.SpyObj<PedidosService>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  const mockPedido: Pedido = {
    id: 'test-id-123',
    estudiante: 'Juan Pérez',
    categoria: 'Uniforme',
    items: [
      {
        categoria: 'Uniforme',
        nombre: 'Camisa',
        precio: 50,
        cantidad: 2,
        total: 100,
        stock: 10,
        estadoEntrega: 'Pendiente' as any
      }
    ],
    total: 100,
    abono: [
      {
        monto: 30,
        metodoPago: 'Efectivo',
        numeroComprobante: '001',
        fecha: '2024-01-15'
      }
    ],
    saldo: 70,
    fecha: '2024-01-10',
    estadoPago: 'Pendiente por Pagar'
  };

  beforeEach(async () => {
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    mockPedidosService = jasmine.createSpyObj('PedidosService', ['abonarPedido']);
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [Detalles],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: PedidosService, useValue: mockPedidosService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detalles);
    component = fixture.componentInstance;
    component.pedido = { ...mockPedido };
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close()', () => {
    it('should emit onClose event when close() is called', () => {
      spyOn(component.onClose, 'emit');
      
      component.close();
      
      expect(component.onClose.emit).toHaveBeenCalledWith();
    });
  });

  describe('saldoRestante', () => {
    it('should calculate saldoRestante correctly by summing all abonos', () => {
      component.pedido = {
        ...mockPedido,
        total: 100,
        abono: [
          { monto: 20, metodoPago: 'Efectivo', numeroComprobante: '001', fecha: '2024-01-15' },
          { monto: 30, metodoPago: 'Transferencia', numeroComprobante: '002', fecha: '2024-01-16' }
        ]
      };
      component.abonoTotal = 0;

      const saldo = component.saldoRestante;

      expect(saldo).toBe(50); // 100 - (20 + 30)
    });

    it('should return total when no abonos exist', () => {
      component.pedido = {
        ...mockPedido,
        total: 100,
        abono: []
      };
      component.abonoTotal = 0;

      const saldo = component.saldoRestante;

      expect(saldo).toBe(100);
    });
  });

  describe('confirmarAbono()', () => {
    beforeEach(() => {
      component.pedido = { ...mockPedido };
      component.abonoTotal = 0;
      component.nuevoAbonoMonto = 0;
      component.nComprobante = 'COMP-123';
      component.mostrandoFormAbono = true;
    });

    it('should show error notification when abono amount is zero', () => {
      component.nuevoAbonoMonto = 0;

      component.confirmarAbono();

      expect(mockNotificationService.showNotification).toHaveBeenCalledWith(
        'El abono debe ser mayor $0 e igual o inferir al saldo total',
        'error'
      );
      expect(mockPedidosService.abonarPedido).not.toHaveBeenCalled();
    });

    it('should show error notification when abono amount is negative', () => {
      component.nuevoAbonoMonto = -10;

      component.confirmarAbono();

      expect(mockNotificationService.showNotification).toHaveBeenCalledWith(
        'El abono debe ser mayor $0 e igual o inferir al saldo total',
        'error'
      );
      expect(mockPedidosService.abonarPedido).not.toHaveBeenCalled();
    });

    it('should show error notification when abono amount exceeds saldo restante', () => {
      component.pedido.total = 100;
      component.pedido.abono = [{ monto: 30, metodoPago: 'Efectivo', numeroComprobante: '001', fecha: '2024-01-15' }];
      component.nuevoAbonoMonto = 80; // Exceeds remaining 70

      component.confirmarAbono();

      expect(mockNotificationService.showNotification).toHaveBeenCalledWith(
        'El abono debe ser mayor $0 e igual o inferir al saldo total',
        'error'
      );
      expect(mockPedidosService.abonarPedido).not.toHaveBeenCalled();
    });

    it('should successfully register abono and update pedido when valid amount is provided', async () => {
      mockPedidosService.abonarPedido.and.returnValue(Promise.resolve());
      component.pedido = {
        ...mockPedido,
        total: 100,
        abono: [{ monto: 30, metodoPago: 'Efectivo', numeroComprobante: '001', fecha: '2024-01-15' }]
      };
      component.abonoTotal = 0;
      component.nuevoAbonoMonto = 40;
      component.nComprobante = 'COMP-456';

      component.confirmarAbono();
      await fixture.whenStable();

      expect(mockPedidosService.abonarPedido).toHaveBeenCalled();
      const callArgs = mockPedidosService.abonarPedido.calls.mostRecent().args[0];
      expect(callArgs.id).toBe('test-id-123');
      expect(callArgs.abono.length).toBe(2);
      expect(callArgs.abono[1].monto).toBe(40);
      expect(callArgs.abono[1].metodoPago).toBe('Transferencia');
      expect(callArgs.abono[1].numeroComprobante).toBe('COMP-456');
      expect(mockNotificationService.showNotification).toHaveBeenCalledWith(
        '¡Abono registrado correctamente!',
        'success'
      );
      expect(component.nuevoAbonoMonto).toBe(0);
      expect(component.mostrandoFormAbono).toBe(false);
      expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
    });

    it('should update estadoPago to "Pagado" when total is fully paid', async () => {
      mockPedidosService.abonarPedido.and.returnValue(Promise.resolve());
      component.pedido = {
        ...mockPedido,
        total: 100,
        abono: [{ monto: 60, metodoPago: 'Efectivo', numeroComprobante: '001', fecha: '2024-01-15' }]
      };
      component.abonoTotal = 0;
      component.nuevoAbonoMonto = 40; // This completes the payment

      component.confirmarAbono();
      await fixture.whenStable();

      const callArgs = mockPedidosService.abonarPedido.calls.mostRecent().args[0];
      expect(callArgs.estadoPago).toBe('Pagado');
    });

    it('should handle error when abonarPedido fails', async () => {
      const errorMessage = 'Firebase error';
      mockPedidosService.abonarPedido.and.returnValue(Promise.reject(errorMessage));
      spyOn(console, 'error');
      component.pedido = {
        ...mockPedido,
        total: 100,
        abono: []
      };
      component.abonoTotal = 0;
      component.nuevoAbonoMonto = 50;

      component.confirmarAbono();
      await fixture.whenStable();

      expect(console.error).toHaveBeenCalledWith('Error guardando abono:', errorMessage);
      expect(mockNotificationService.showNotification).toHaveBeenCalledWith(
        '¡Error al registrar el abono!',
        'error'
      );
    });
  });

  describe('imprimir()', () => {
    it('should show info notification when imprimir is called', () => {
      component.pedido = mockPedido;
      spyOn(console, 'log');

      component.imprimir();

      expect(mockNotificationService.showNotification).toHaveBeenCalledWith(
        'Preparando vista de impresión...',
        'info'
      );
      expect(console.log).toHaveBeenCalledWith('Generando PDF para el pedido:', mockPedido.fecha);
    });
  });

  describe('registrarAbono()', () => {
    it('should show info notification about future availability', () => {
      component.registrarAbono();

      expect(mockNotificationService.showNotification).toHaveBeenCalledWith(
        'Función de abonos disponible en la siguiente actualización',
        'info'
      );
    });
  });

  describe('getSaldoTotal()', () => {
    it('should return correct saldo total', () => {
      component.pedido = {
        ...mockPedido,
        total: 100
      };
      component.abonoTotal = 35;

      const saldo = component.getSaldoTotal();

      expect(saldo).toBe(65);
    });
  });
});

import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../../service/notificaciones/notificaciones';
import { Pedido } from '../../../../../shared/models/producto.model';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../../../../service/PedidosUniformes/pedidosUnSrv';

@Component({
  selector: 'app-detalle-pedido',
  imports: [CommonModule, FormsModule],
  templateUrl: './detalles.html',
  styleUrl: './detalles.scss',
})
export class Detalles {
  private notifService = inject(NotificationService);
  private PedidosService = inject(PedidosService);
  private cd = inject(ChangeDetectorRef);

  mostrandoFormAbono = false;
  nuevoAbonoMonto: number = 0;
  nuevoAbonoMetodo: string = 'Efectivo';
  actualizacion!: Pedido;
  abonoTotal: number = 0;
  nComprobante: string = '';

  @Input() isOpen: boolean = false;
  @Input() pedido!: Pedido;

  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }

  imprimir() {
    this.notifService.showNotification('Preparando vista de impresión...', 'info');
    console.log('Generando PDF para el pedido:', this.pedido.fecha);
  }

  registrarAbono() {
    this.notifService.showNotification(
      'Función de abonos disponible en la siguiente actualización',
      'info',
    );
  }

  get saldoRestante(): number {
    return this.pedido.total - this.pedido.abonoTotal;
  }

  confirmarAbono() {
    if (this.nuevoAbonoMonto > 0 && this.nuevoAbonoMonto <= this.saldoRestante) {
      const abonoTotal = {
        monto: this.nuevoAbonoMonto,
        metodoPago: 'Transferencia',
        numeroComprobante: this.nComprobante,
        fecha: new Date().toISOString().substring(0, 10),
      };
      this.getAbonoTotal()

      this.actualizacion = {
        ...this.pedido,
        id: this.pedido.id,
        abono: [...this.pedido.abono, abonoTotal],
        saldo: this.getSaldoTotal(),
        abonoTotal: this.abonoTotal,
        estadoPago: this.getSaldoTotal() === 0 ? 'Pagado' : 'Pendiente por Pagar',
      };
      console.log("Act", this.actualizacion.abonoTotal)

      this.PedidosService.abonarPedido(this.actualizacion)
        .then((res) => {
          this.notifService.showNotification('¡Abono registrado correctamente!', 'success');
          this.nuevoAbonoMonto = 0;
          this.mostrandoFormAbono = false;
          this.close();
          this.cd.detectChanges();
        })
        .catch((error) => {
          console.error('Error guardando abono:', error);
          this.notifService.showNotification('¡Error al registrar el abono!', 'error');
        });
    } else {
      this.notifService.showNotification(
        'El abono debe ser mayor $0 e igual o inferir al saldo total',
        'error',
      );
    }
  }

  getSaldoTotal(): number {
    this.abonoTotal = this.pedido.abonoTotal + this.nuevoAbonoMonto;
    return this.pedido.total - this.abonoTotal;
  }

  getAbonoTotal() {
    this.abonoTotal = 0;
    this.abonoTotal = this.pedido.abonoTotal + this.nuevoAbonoMonto;

  }
}

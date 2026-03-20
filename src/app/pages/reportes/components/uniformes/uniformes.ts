import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../../../service/PedidosUniformes/pedidosUnSrv';
import { Abono, Pedido } from '../../../../shared/models/producto.model';
import { EstadoEntrega } from '../../../../shared/models/enums';
import { Estudiante } from '../../../../shared/models/estudiantes.model';
import { StudentService } from '../../../../service/estudiantes';
import { Detalles } from './detalles/detalles';

@Component({
  selector: 'app-uniformes',
  imports: [NgClass, FormsModule, CommonModule, Detalles],
  templateUrl: './uniformes.html',
  styleUrl: './uniformes.scss',
})
export class RepUniformes implements OnInit {
  private PedidosService = inject(PedidosService);
  private cd = inject(ChangeDetectorRef);
  pedidoSeleccionado: any;
  panelDetalleAbierto: boolean = false;

  fechaMaxima: string = new Date().toISOString().split('T')[0];
  fechaInicio: string = '';
  fechaFin: string = '';
  filtroNombre: string = '';
  estudiantesFiltrados: Estudiante[] = [];
  estudiantesFiltradosAux: Estudiante[] = [];

  totalPedidos = 0;
  totalPorRecaudar = 0;

  AllPedidos: Pedido[] = [];

  pedidosFiltrados: Pedido[] = [];

  ngOnInit() {
    this.getAllPedidos();
  }

  filtrarEstudiantes() {
    const texto = this.filtroNombre.toLowerCase();

    this.pedidosFiltrados = this.AllPedidos.filter((p) =>
      p.estudiante.toLowerCase().includes(texto),
    );
  }

  getAllPedidos() {
    this.PedidosService.getPedidos().subscribe((data) => {
      this.AllPedidos = data;
      this.pedidosFiltrados = data;
      this.totalPedidos = data.length;
      this.AllPedidos.forEach((pedido) => {
        this.totalPorRecaudar += pedido.saldo;
      });
      this.cd.detectChanges();
    });
  }

  getAbonoTotal(abonos: Abono[]) {
    const aboTotal = abonos.forEach((abono) => {
      return +abono.monto;
    });
    return aboTotal;
  }

  consultar() {
    if (this.fechaInicio && this.fechaFin) {
      const inicio = new Date(this.fechaInicio);
      const fin = new Date(this.fechaFin);

      this.pedidosFiltrados = this.AllPedidos.filter((pedido) => {
        const fechaPedido = new Date(pedido.fecha);

        return fechaPedido >= inicio && fechaPedido <= fin;
      });
    } else {
      this.pedidosFiltrados = this.AllPedidos;
    }
  }

  openModalDetalle(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
    this.panelDetalleAbierto = true;
  }

  cerrarPanel() {
    this.panelDetalleAbierto = false;
  }

  imprimirRecibo(recibo: Pedido) {
    const ventana = window.open('', '_blank', 'width=800,height=600');
    const usuario = localStorage.getItem('currentUser');

    const detalleItems = recibo.items
      .map(
        (item) => `
    <tr>
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>$${item.precio.toLocaleString()}</td>
      <td>$${(item.cantidad * item.precio).toLocaleString()}</td>
    </tr>
  `,
      )
      .join('');

    if (!ventana) return;

    ventana.document.write(`
    <html>
      <head>
        <title>Recibo ${recibo.estudiante}</title>
        <style>
          body { font-family: Arial; padding: 30px; }
          h2, h3, p { text-align: center; }
          .line { margin: 10px 0; }
        </style>
      </head>
      <body>
        <h3>INSTITUTO EDUCATIVO</h3>
        <h2>NUEVA AMERICA</h2>
        <p>NIT: 800008061-8</p>
        <p>Nuevo Bosque Mz 52 Lt 02 etapa 7</p>
        <p>Cartagena, Bolívar.</p>
        <p>Tel. 605 6654780</p>

        <h2>RECIBO DE UNIFORME</h2>
        <div class="line"><strong>Estudiante:</strong> ${recibo.estudiante}</div>

        <h3>Detalle del Pedido</h3>

        <table border="1" width="100%" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${detalleItems}
          </tbody>
        </table>
      
        <br/>
        <div class="line"><strong>Valor Total:</strong> $${recibo.total.toLocaleString()}</div>
        <div class="line"><strong>Abono:</strong> $${recibo.abonoTotal.toLocaleString()}</div>
        <div class="line"><strong>Fecha del ultimo abono:</strong> ${recibo.abono[recibo.abono.length-1].fecha}</div>
        <div class="line"><strong>Responsable:</strong> ${usuario?.split('@')[0]}</div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        <\/script>
      </body>
    </html>
  `);

    ventana.document.close();
  }
}

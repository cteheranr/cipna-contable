import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { StudentService } from '../../../../service/estudiantes';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Estudiante } from '../../../../shared/models/estudiantes.model';
import { Estudiantes } from '../../../estudiantes/estudiantes';
import { Pedido, PedidosUniforme, Producto } from '../../../../shared/models/producto.model';
import { EstadoEntrega } from '../../../../shared/models/enums';
import { PedidosService } from '../../../../service/PedidosUniformes/pedidosUnSrv';
import { NotificationService } from '../../../../service/notificaciones/notificaciones';

@Component({
  selector: 'app-uniformes',
  imports: [FormsModule, CommonModule],
  templateUrl: './uniformes.html',
  styleUrl: './uniformes.scss',
})
export class Uniformes implements OnInit {
  private studentService = inject(StudentService);
  private PedidosService = inject(PedidosService);
  private notifService = inject(NotificationService);
  private cd = inject(ChangeDetectorRef);

  busquedaEstudiante = '';
  estudiantesFiltrados: Estudiante[] = [];
  estudiantesFiltradosAux: Estudiante[] = [];
  estudianteSeleccionado!: Estudiante;

  listaProductos: Producto[] = [];

  productoActual: Producto | null = null;
  cantidadActual = 0;
  pedido: PedidosUniforme[] = [];
  totalPedido = 0;
  montoAbono = 0;
  entregado: boolean = false;
  nComprobante: string = '';

  ngOnInit() {
    this.getProduts();
  }

  getProduts() {
    this.PedidosService.getUniformes().subscribe((data) => {
      this.listaProductos = data;
      this.cd.detectChanges();
    });
  }

  filtrarEstudiantes() {
    if (this.busquedaEstudiante.length > 2) {
      const data = localStorage.getItem('estudiantes');
      if (data) {
        this.estudiantesFiltradosAux = JSON.parse(data);
        this.estudiantesFiltrados = this.estudiantesFiltradosAux
          .filter(
            (e) =>
              e.nombres.toLowerCase().includes(this.busquedaEstudiante.toLowerCase()) ||
              e.numeroDocumento.toString().includes(this.busquedaEstudiante) || 
              e.apellidos.toLowerCase().includes(this.busquedaEstudiante.toLowerCase()),
          )
          .slice(0, 5);
      } else {
        this.studentService.getStudents().subscribe((list) => {
          this.estudiantesFiltrados = list
            .filter(
              (e) =>
                e.nombres.toLowerCase().includes(this.busquedaEstudiante.toLowerCase()) ||
                e.numeroDocumento.toString().includes(this.busquedaEstudiante) ||
                e.apellidos.toLowerCase().includes(this.busquedaEstudiante.toLowerCase()),
            )
            .slice(0, 5);
        });
      }
    } else {
      this.estudiantesFiltrados = [];
    }
  }

  seleccionarEstudiante(est: any) {
    this.estudianteSeleccionado = est;
    this.busquedaEstudiante = est.nombre;
    this.estudiantesFiltrados = [];
  }

  agregarAlPedido() {
    if (this.productoActual) {
      const item = {
        ...this.productoActual,
        cantidad: this.cantidadActual,
        total: this.productoActual.precio * this.cantidadActual,
        estadoEntrega: EstadoEntrega.PENDIENTE,
      };
      this.pedido.push(item);
      this.totalPedido += item.total;
      this.productoActual = null;
      this.cantidadActual = 1;
    }
  }

  registrarVenta() {
    const abono = [{
      monto: this.montoAbono,
      metodoPago: "Transferencia",
      numeroComprobante: this.nComprobante,
      fecha: new Date().toISOString().substring(0, 10),
    },]

    const dataVenta = {
      estudiante: this.estudianteSeleccionado.nombres + ' ' + this.estudianteSeleccionado.apellidos,
      categoria: 'uniforme',
      items: this.pedido,
      total: this.totalPedido,
      abono: abono,
      abonoTotal: this.montoAbono,
      saldo: this.totalPedido - this.montoAbono,
      fecha: new Date().toISOString().substring(0, 10),
      estadoPago: this.totalPedido - this.montoAbono === 0 ? 'Pagado' : 'Pendiente por Pagar',
    };

    this.PedidosService.addPedidoUniforme(dataVenta)
      .then((res) => {
        this.notifService.showNotification('¡Venta de uniforme registrada con éxito!', 'success');
        this.imprimirRecibo(dataVenta);
      })
      .catch((error) => {
        this.notifService.showNotification('Error al registrar el pedido', 'error');
      });
  }

  eliminarProducto(item: number) {
    const descontar = this.pedido[item].precio;
    this.totalPedido -= descontar;
    this.pedido.splice(item, 1);
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
        <div class="line"><strong>Abono:</strong> $${recibo.abono.toLocaleString()}</div>
        <div class="line"><strong>Fecha:</strong> ${recibo.fecha}</div>
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
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}
